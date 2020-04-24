import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

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
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkBookRequestCreate, checkBookRequestUpdate } from '../checks/bookRequestCheck';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import {
  createBookRequestFromDbRow,
  transformBookRequestUpdateFromBookRequest,
} from '../db/transformations/bookRequestTransformation';

import { bookDataQueries } from '../db/queries/bookDataQueries';
import { bookDataRepository } from './BookDataRepository';


interface BookRequestRepository extends Repository {
  createBookRequest: CreateActionWithContext<BookRequest>;
  readBookRequestByBookDataId: ReadActionWithContext<BookRequest>;
  readAllBookRequests: ReadAllActionWithContext<BookRequest>;
  updateBookRequest: UpdateActionWithContext<BookRequest>;
  deleteBookRequest: DeleteActionWithContext<BookRequest>;
}

export const bookRequestRepository: BookRequestRepository = {
  name: RepositoryName.bookRequest,

  createBookRequest: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRequestRepository.name, body);

    const { checked, checkError } = checkBookRequestCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const {
        userId, userBookingId, comment, createdByBookingUser,
      } = checked;
      const bookData = await bookDataRepository.createBookDataFromRequest(context, loggedUserId, checked.bookData);

      const row = await context.executeSingleResultQuery(bookRequestQueries.createBookRequest, bookData.id, userId, userBookingId, comment, createdByBookingUser);
      return createBookRequestFromDbRow(row);
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
      const row = await context.executeSingleResultQuery(bookRequestQueries.getBookRequestByBookDataId, bookDataId);
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookRequests: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRequestRepository.name);

    try {
      const rows = await context.executeQuery(bookRequestQueries.getAllBookRequests);
      return createArrayFromDbRows(rows, createBookRequestFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookRequest: async (context, loggedUserId, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookRequestRepository.name, bookDataId, body);

    const { checked, checkError } = checkBookRequestUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, bookDataId);

      // todo if you are logged in as userId, you can only update comment
      // todo if you are logged in as userBookingId, and it is not createdByUserBooking you only can delete yourself
      // todo if you are logged in as userBookingId, and it is createdByUserBooking you only update comment

      const currentData = transformBookRequestUpdateFromBookRequest(current);
      const mergedUpdateData = merge(currentData, checked);

      const { userBookingId, comment } = mergedUpdateData;
      const row = await context.executeSingleResultQuery(bookRequestQueries.updateBookRequest, bookDataId, userBookingId, comment);
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookRequest: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookRequestRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(bookRequestQueries.deleteBookRequest, bookDataId);
      const deletedBookRequest = createBookRequestFromDbRow(row);

      await context.executeSingleResultQuery(bookDataQueries.deleteBookData, bookDataId);

      return deletedBookRequest;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
