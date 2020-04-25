import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ForbiddenMessage, PathErrorMessage } from '../constants/ErrorMessages';

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

import { checkBookRequestCreate, checkBookRequestUpdate } from '../checks/bookRequestCheck';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import {
  createBookRequestFromDbRow,
  transformBookRequestUpdateFromBookRequest,
} from '../db/transformations/bookRequestTransformation';

import { bookDataQueries } from '../db/queries/bookDataQueries';
import { createBookDataFromDbRow } from '../db/transformations/bookDataTransformation';
import { checkBookDataCreateFromBookRequest } from '../checks/bookDataCheck';


interface BookRequestRepository extends Repository {
  createBookRequest: CreateActionWithContext<BookRequest>;
  readBookRequestByBookDataId: ReadActionWithContext<BookRequest>;
  readAllBookRequests: ReadAllActionWithContext<BookRequest>;
  updateBookRequest: UpdateActionWithContext<BookRequest>;
  deleteBookRequestOnly: SimpleAction<string | number, BookRequest>;
  deleteBookRequest: DeleteActionWithContext<BookRequest>;
}

export const bookRequestRepository: BookRequestRepository = {
  name: RepositoryName.bookRequest,

  createBookRequest: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRequestRepository.name, body);

    const checked = checkBookRequestCreate(body, errPrefix, errPostfix);

    try {
      const {
        bookId, publisher, yearPublished, isbn, image, format, genreId,
      } = checkBookDataCreateFromBookRequest(body, errPrefix, errPostfix);
      await context.executeSingleResultQuery(
        createBookDataFromDbRow,
        bookDataQueries.createBookData, bookId, null, publisher, yearPublished, isbn, image, format, genreId,
      );

      const {
        userId, userBookingId, comment, createdByBookingUser,
      } = checked;
      return await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.createBookRequest, bookId, userId, userBookingId, comment, createdByBookingUser);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookRequestByBookDataId: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRequestRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      return await context.executeSingleResultQuery(
        createBookRequestFromDbRow,
        bookRequestQueries.getBookRequestByBookDataId, bookDataId,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookRequests: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRequestRepository.name);

    try {
      return await context.executeQuery(createBookRequestFromDbRow, bookRequestQueries.getAllBookRequests);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookRequest: async (context, loggedUserId, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookRequestRepository.name, bookDataId, body);

    const checked = checkBookRequestUpdate(body, errPrefix, errPostfix);

    try {
      const current = await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, bookDataId);

      // todo if you are logged in as userId, you can only update comment
      // todo if you are logged in as userBookingId, and it is not createdByUserBooking you only can delete yourself
      // todo if you are logged in as userBookingId, and it is createdByUserBooking you only update comment

      const currentData = transformBookRequestUpdateFromBookRequest(current);
      const mergedUpdateData = merge(currentData, checked);

      const { userBookingId, comment } = mergedUpdateData;
      return await context.executeSingleResultQuery(
        createBookRequestFromDbRow,
        bookRequestQueries.updateBookRequest, bookDataId, userBookingId, comment,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookRequestOnly: async (context, loggedUserId, bookDataId, errPrefix, errPostfix) => {
    try {
      const bookRequest = await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, bookDataId);
      if ((bookRequest.createdByBookingUser && bookRequest.userBookingId !== loggedUserId)
        || (!bookRequest.createdByBookingUser && bookRequest.userId !== loggedUserId)) {
        return Promise.reject(getHttpError.getForbiddenError(ForbiddenMessage.notQualifiedForAction, errPrefix, errPostfix));
      }
      return await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookRequest: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookRequestRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    const deleted = bookRequestRepository.deleteBookRequestOnly(context, loggedUserId, bookDataId, errPrefix, errPostfix);

    try {
      // delete book data too
      await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.deleteBookData, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }

    return deleted;
  },
};
