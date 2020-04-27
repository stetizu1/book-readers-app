import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkBookDataCreate, checkBookDataUpdate } from '../checks/body/bookData';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import {
  convertToBookDataWithLabelIds,
  convertDbRowToBookData,
  convertBookDataToBookDataUpdate,
} from '../db/transformations/bookDataTransformation';

import { personalBookDataRepository } from './PersonalBookDataRepository';
import { reviewRepository } from './ReviewRepository';
import { hasLabelRepository } from './HasLabelRepository';

import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';

import { convertHasLabelToDbRow } from '../db/transformations/hasLabelTransformation';
import { convertDbRowToBookRequest } from '../db/transformations/bookRequestTransformation';
import {
  checkPermissionBookDataCreate,
  checkPermissionBookDataRead,
  checkPermissionBookDataUpdate,
  checkPermissionBookDataDelete,
} from '../checks/forbidden/bookData';
import { checkConflictBookDataUpdate } from '../checks/conflict/bookData';


interface BookDataRepository extends Repository {
  createBookData: CreateActionWithContext<BookData>;
  readBookDataById: ReadActionWithContext<BookData | BookDataWithLabelIds>;
  readAllBookData: ReadAllActionWithContext<BookData>;
  updateBookData: UpdateActionWithContext<BookData>;
  deleteBookData: DeleteActionWithContext<BookData>;
}

export const bookDataRepository: BookDataRepository = {
  name: RepositoryName.bookData,

  createBookData: async (context, loggedUserId, body) => {
    try {
      const bookDataCreate = checkBookDataCreate(body);
      await checkPermissionBookDataCreate(context, loggedUserId, bookDataCreate.labelsIds);

      const {
        bookId, publisher, yearPublished, isbn, image, format, genreId, personalBookData, review, labelsIds,
      } = bookDataCreate;
      const createdBookData = await context.executeSingleResultQuery(
        convertDbRowToBookData,
        bookDataQueries.createBookData,
        bookId, loggedUserId, publisher, yearPublished, isbn, image, format, genreId,
      );

      const bookDataId = createdBookData.id;

      if (!isUndefined(personalBookData)) {
        await personalBookDataRepository.createPersonalBookData(context, loggedUserId, {
          ...personalBookData,
          bookDataId,
        });
      }

      if (!isUndefined(review)) {
        await reviewRepository.createReview(context, loggedUserId, {
          ...review,
          bookDataId,
        });
      }

      if (!isUndefined(labelsIds)) {
        await Promise.all(
          labelsIds.map((labelId) => {
            const hasLabel: HasLabel = { bookDataId, labelId };
            return hasLabelRepository.createHasLabel(context, loggedUserId, hasLabel);
          }),
        );
      }

      return createdBookData;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookDataRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookDataById: async (context, loggedUserId, id) => {
    try {
      checkParameterId(id);
      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, id);
      await checkPermissionBookDataRead(context, loggedUserId, Number(id), bookData.userId);

      // If user is logged in, return with his labels
      if (loggedUserId === bookData.userId) {
        const hasLabels = await context.executeQuery(convertHasLabelToDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookData.id);
        return convertToBookDataWithLabelIds(bookData, hasLabels);
      }

      return bookData;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookDataRepository.name, id);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookData: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToBookData, bookDataQueries.getAllBookData, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookDataRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookData: async (context, loggedUserId, id, body) => {
    try {
      checkParameterId(id);
      const bookDataUpdate = checkBookDataUpdate(body);
      await checkPermissionBookDataUpdate(context, loggedUserId, Number(id), bookDataUpdate.userId);
      const current = await bookDataRepository.readBookDataById(context, loggedUserId, id);
      await checkConflictBookDataUpdate(context, loggedUserId, bookDataUpdate.userId, current.userId);

      const currentData = convertBookDataToBookDataUpdate(current);
      const mergedUpdateData = merge(currentData, bookDataUpdate);
      const {
        userId, publisher, yearPublished, isbn, image, format, genreId,
      } = mergedUpdateData;

      // delete book request if user is set
      if (!isUndefined.or(isNull)(bookDataUpdate.userId)) {
        await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.deleteBookRequest, id);
      }

      // update labels
      const newLabels = bookDataUpdate.labelsIds;
      if (!isUndefined(newLabels)) {
        await Promise.all(
          newLabels
            .filter((labelId) => !currentData.labelsIds.includes(labelId))
            .map(async (labelId) => (
              context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.createHasLabel, id, labelId)
            )),
        );
        await Promise.all(
          currentData.labelsIds
            .filter((labelId) => !newLabels.includes(labelId))
            .map(async (labelId) => (
              context.executeSingleResultQuery(convertHasLabelToDbRow, hasLabelQueries.deleteHasLabel, id, labelId)
            )),
        );
      }

      return await context.executeSingleResultQuery(
        convertDbRowToBookData,
        bookDataQueries.updateBookData,
        id, userId, publisher, yearPublished, isbn, image, format, genreId,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookDataRepository.name, id, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookData: async (context, loggedUserId, id) => {
    try {
      checkParameterId(id);
      const { userId } = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, id);
      await checkPermissionBookDataDelete(context, loggedUserId, Number(id), userId);
      if (isNull(userId)) {
        await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.deleteBookRequest, id);
      }
      return await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.deleteBookData, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookDataRepository.name, id);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
