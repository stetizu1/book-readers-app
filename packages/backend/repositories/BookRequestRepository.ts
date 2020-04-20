import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkBookRequestCreate, checkBookRequestUpdate } from '../checks/bookRequestCheck';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import {
  createBookRequestFromDbRow,
  transformBookRequestUpdateFromBookRequest,
} from '../db/transformations/bookRequestTransformation';
import { bookDataRepository } from './BookDataRepository';


interface BookRequestRepository extends Repository {
  createBookRequest: CreateActionWithContext<BookRequest>;
  readBookRequestByBookDataId: ReadActionWithContext<BookRequest>;
  readAllBookRequests: ReadAllActionWithContext<BookRequest>;
  updateBookRequest: UpdateActionWithContext<BookRequest>;
}

export const bookRequestRepository: BookRequestRepository = {
  name: RepositoryName.bookRequest,

  createBookRequest: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRequestRepository.name, body);

    const { checked, checkError } = checkBookRequestCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const {
        userId, userBookingId, comment, createdByBookingUser,
      } = checked;
      const bookData = await bookDataRepository.createBookDataFromRequest(context, checked.bookData);

      const row = await context.executeSingleResultQuery(bookRequestQueries.createBookRequest, stringifyParams(bookData.id, userId, userBookingId, comment, createdByBookingUser));
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookRequestByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRequestRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(bookRequestQueries.getBookRequestByBookDataId, stringifyParams(bookDataId));
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookRequests: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRequestRepository.name);

    try {
      const rows = await context.executeQuery(bookRequestQueries.getAllBookRequests);
      return createArrayFromDbRows(rows, createBookRequestFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookRequest: async (context, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookRequestRepository.name, bookDataId, body);

    const { checked, checkError } = checkBookRequestUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await bookRequestRepository.readBookRequestByBookDataId(context, bookDataId);

      // todo if you are logged in as userId, you can only update comment
      // todo if you are logged in as userBookingId, and it is not createdByUserBooking you only can delete yourself
      // todo if you are logged in as userBookingId, and it is createdByUserBooking you only update comment

      const currentData = transformBookRequestUpdateFromBookRequest(current);
      const mergedUpdateData = merge(currentData, checked);

      const { userBookingId, comment } = mergedUpdateData;
      const row = await context.executeSingleResultQuery(bookRequestQueries.updateBookRequest, stringifyParams(bookDataId, userBookingId, comment));
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
