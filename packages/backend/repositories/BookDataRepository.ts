import { BookData, BookDataCreate, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ConflictErrorMessage, ForbiddenMessage, PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext, DeleteActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext, SimpleAction,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkBookDataCreate, checkBookDataUpdate } from '../checks/bookDataCheck';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import {
  composeBookDataAndLabels,
  createBookDataFromDbRow,
  transformBookDataUpdateFromBookData,
} from '../db/transformations/bookDataTransformation';

import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { personalBookDataRepository } from './PersonalBookDataRepository';
import { reviewRepository } from './ReviewRepository';
import { hasLabelRepository } from './HasLabelRepository';
import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';
import { authRepository } from './AuthRepository';
import { bookRequestRepository } from './BookRequestRepository';


interface BookDataRepository extends Repository {
  createBookDataSimple: SimpleAction<BookDataCreate, BookData>;
  createBookData: CreateActionWithContext<BookData>;
  readBookDataSimple: SimpleAction<string | number, BookDataWithLabelIds>;
  readBookDataById: ReadActionWithContext<BookDataWithLabelIds>;
  readAllBookData: ReadAllActionWithContext<BookData>;
  updateBookData: UpdateActionWithContext<BookData>;
  deleteBookData: DeleteActionWithContext<BookData>;
}

export const bookDataRepository: BookDataRepository = {
  name: RepositoryName.bookData,

  createBookDataSimple: async (context, userId, create, errPrefix, errPostfix) => {
    const {
      bookId, publisher, yearPublished, isbn, image, format, genreId,
    } = create;
    try {
      return await context.executeSingleResultQuery(
        createBookDataFromDbRow, bookDataQueries.createBookData, bookId, userId, publisher, yearPublished, isbn, image, format, genreId,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  createBookData: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookDataRepository.name, body);
    const checked = checkBookDataCreate(body, errPrefix, errPostfix);

    const createdBookData = await bookDataRepository.createBookDataSimple(context, loggedUserId, checked, errPrefix, errPostfix);
    const bookDataId = createdBookData.id;
    const {
      labelsIds, personalBookData, review,
    } = checked;

    if (!isUndefined(labelsIds)) {
      await Promise.all(
        labelsIds.map((labelId) => {
          const hasLabel: HasLabel = { bookDataId, labelId };
          return hasLabelRepository.createHasLabel(context, loggedUserId, hasLabel);
        }),
      );
    }

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

    return createdBookData;
  },

  readBookDataSimple: async (context, userId, id, errPrefix, errPostfix) => {
    try {
      const bookData = await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.getBookDataById, id);
      const hasLabels = await context.executeQuery(createHasLabelFromDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookData.id);
      return composeBookDataAndLabels(bookData, hasLabels);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookDataById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookDataRepository.name, id);
    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    const bookDataWithLabelIds = await bookDataRepository.readBookDataSimple(context, loggedUserId, id, errPrefix, errPostfix);
    const { userId } = bookDataWithLabelIds;
    // check permission
    if (!isNull(userId)) {
      // permission by userId
      await authRepository.isYouOrIsOneOfYourFriends(context, loggedUserId, userId);
    } else {
      // permission in connected book request
      await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, id);
    }
    return bookDataWithLabelIds;
  },

  readAllBookData: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookDataRepository.name);
    try {
      return await context.executeQuery(createBookDataFromDbRow, bookDataQueries.getAllBookData, loggedUserId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookData: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookDataRepository.name, id, body);

    const checked = checkBookDataUpdate(body, errPrefix, errPostfix);

    try {
      const current = await bookDataRepository.readBookDataById(context, loggedUserId, id);
      const currentData = transformBookDataUpdateFromBookData(current);
      const mergedUpdateData = merge(currentData, checked);
      const {
        userId, publisher, yearPublished, isbn, image, format, genreId,
      } = mergedUpdateData;

      if (!isUndefined(checked.userId)) {
        if (checked.userId !== loggedUserId) {
          return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix, ForbiddenMessage.unqualifiedForAction));
        }
        if (!isNull(current.userId)) {
          return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, ConflictErrorMessage.bookDataUserExists));
        }
        // delete book request
        await bookRequestRepository.deleteBookRequestOnly(context, loggedUserId, id, errPrefix, errPostfix);
      }

      const newLabels = checked.labelsIds;
      if (newLabels) {
        await Promise.all(
          newLabels
            .filter((labelId) => !currentData.labelsIds.includes(labelId))
            .map(async (labelId) => (
              context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.createHasLabel, id, labelId)
            )),
        );
        await Promise.all(
          currentData.labelsIds
            .filter((labelId) => !newLabels.includes(labelId))
            .map(async (labelId) => (
              context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.deleteHasLabel, id, labelId)
            )),
        );
      }
      return await context.executeSingleResultQuery(
        createBookDataFromDbRow,
        bookDataQueries.updateBookData,
        id, userId, publisher, yearPublished, isbn, image, format, genreId,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookData: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookDataRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const existing = await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.getBookDataById, id);
      if (!isNull(existing.userId) && existing.userId === loggedUserId) {
        return Promise.reject(getHttpError.getNotFoundError(errPrefix, errPostfix));
      }
      if (isNull(existing.userId)) {
        await bookRequestRepository.deleteBookRequestOnly(context, loggedUserId, id, errPrefix, errPostfix);
      }
      return await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.deleteBookData, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
