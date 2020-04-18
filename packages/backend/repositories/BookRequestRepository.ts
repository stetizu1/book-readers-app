import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';
import { createArrayFromDbRows } from '../db/createFromDbRow';

import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { createBookRequestFromDbRow } from '../db/transformations/bookRequestTransformation';
import { checkBookRequestCreate } from '../checks/bookRequestCheck';


interface BookRequestRepository extends Repository {
  createBookRequest: CreateActionWithContext<BookRequest>;
  readBookRequestByBookDataId: ReadActionWithContext<BookRequest>;
  readAllBookRequests: ReadAllActionWithContext<BookRequest>;
}

export const bookRequestRepository: BookRequestRepository = {
  name: 'BookRequest',

  createBookRequest: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookRequestRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBookRequestCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const {
        bookDataId, userId, userBookingId, comment, createdByBookingUser,
      } = checked;
      const row = await context.transaction.executeSingleResultQuery(bookRequestQueries.createBookRequest, stringifyParams(bookDataId, userId, userBookingId, comment, createdByBookingUser));
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookRequestByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookRequestRepository.name, ErrorMethod.Read, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(bookRequestQueries.getBookRequestByBookDataId, stringifyParams(bookDataId));
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookRequests: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookRequestRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(bookRequestQueries.getAllBookRequests);
      return createArrayFromDbRows(rows, createBookRequestFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
