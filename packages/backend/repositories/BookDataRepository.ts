import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ConflictErrorMessage, PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext, DeleteActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkBookDataCreate, checkBookDataCreateFromBookRequest, checkBookDataUpdate } from '../checks/bookDataCheck';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import {
  composeBookDataAndLabels,
  createBookDataFromDbRow,
  transformBookDataUpdateFromBookData,
} from '../db/transformations/bookDataTransformation';

import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { personalBookDataRepository } from './PersonalBookDataRepository';
import { reviewRepository } from './ReviewRepository';
import { hasLabelRepository } from './HasLabelRepository';
import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';
import { createBookRequestFromDbRow } from '../db/transformations/bookRequestTransformation';


interface BookDataRepository extends Repository {
  createBookData: CreateActionWithContext<BookData>;
  createBookDataFromRequest: CreateActionWithContext<BookData>;
  readBookDataById: ReadActionWithContext<BookDataWithLabelIds>;
  readAllBookData: ReadAllActionWithContext<BookData>;
  updateBookData: UpdateActionWithContext<BookData>;
  deleteBookData: DeleteActionWithContext<BookData>;
}

export const bookDataRepository: BookDataRepository = {
  name: RepositoryName.bookData,

  createBookData: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookDataRepository.name, body);

    const checked = checkBookDataCreate(body, errPrefix, errPostfix);

    const {
      bookId, userId, publisher, yearPublished, isbn, image, format, genreId, labelsIds, personalBookData, review,
    } = checked;

    try {
      const createdBookData = await context.executeSingleResultQuery(
        createBookDataFromDbRow, bookDataQueries.createBookData, bookId, userId, publisher, yearPublished, isbn, image, format, genreId,
      );
      const bookDataId = createdBookData.id;

      if (labelsIds) {
        await Promise.all(
          labelsIds.map((labelId) => {
            const hasLabel: HasLabel = { bookDataId, labelId };
            return hasLabelRepository.createHasLabel(context, loggedUserId, hasLabel);
          }),
        );
      }

      if (personalBookData) {
        await personalBookDataRepository.createPersonalBookData(context, loggedUserId, {
          ...personalBookData,
          bookDataId,
        });
      }

      if (review) {
        await reviewRepository.createReview(context, loggedUserId, { ...review, bookDataId });
      }

      return createdBookData;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  createBookDataFromRequest: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookDataRepository.name, body);

    const checked = checkBookDataCreateFromBookRequest(body, errPrefix, errPostfix);

    const {
      bookId, publisher, yearPublished, isbn, image, format, genreId,
    } = checked;
    const userId = null;

    try {
      return await context.executeSingleResultQuery(
        createBookDataFromDbRow, bookDataQueries.createBookData, bookId, userId, publisher, yearPublished, isbn, image, format, genreId,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookDataById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookDataRepository.name, id);
    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const bookData = await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.getBookDataById, id);
      const hasLabels = await context.executeQuery(createHasLabelFromDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookData.id);
      return composeBookDataAndLabels(bookData, hasLabels);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookData: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookDataRepository.name);
    try {
      return await context.executeQuery(createBookDataFromDbRow, bookDataQueries.getAllBookData);
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

      if (!isUndefined(checked.userId)) {
        if (!isNull(current.userId)) {
          return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, ConflictErrorMessage.bookDataUserExists));
        }
        // todo delete request
      }

      if (checked.labelsIds) {
        const newLabels = checked.labelsIds;
        const oldLabels = currentData.labelsIds;

        const addLabels = newLabels.filter((labelId) => !oldLabels.includes(labelId));
        const deleteLabels = oldLabels.filter((labelId) => !newLabels.includes(labelId));

        await Promise.all(
          addLabels.map(async (labelId) => (
            context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.createHasLabel, id, labelId)
          )),
        );
        await Promise.all(
          deleteLabels.map(async (labelId) => (
            context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.deleteHasLabel, id, labelId)
          )),
        );
      }

      // todo you can only add your userId

      const mergedUpdateData = merge(currentData, checked);

      const {
        userId, publisher, yearPublished, isbn, image, format, genreId,
      } = mergedUpdateData;


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
      // todo delete if it is only our data or
      if (isNull(existing.userId)) {
        // const request = await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.getBookRequestByBookDataId, id);
        // todo if (request.userId !== yours && (!request.createdByBookingUser || request.bookingUserId !== yours)) - error
        await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, id);
      }
      return await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.deleteBookData, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
