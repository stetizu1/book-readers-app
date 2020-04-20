import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';

import { checkBookRequestCreate } from '../checks/bookRequestCheck';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { createBookRequestFromDbRow } from '../db/transformations/bookRequestTransformation';


interface BookRequestRepository extends Repository {
  createBookRequest: CreateActionWithContext<BookRequest>;
  readBookRequestByBookDataId: ReadActionWithContext<BookRequest>;
  readAllBookRequests: ReadAllActionWithContext<BookRequest>;
}

export const bookRequestRepository: BookRequestRepository = {
  name: RepositoryName.bookRequest,

  createBookRequest: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRequestRepository.name, body);

    const { checked, checkError } = checkBookRequestCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const {
        bookDataId, userId, userBookingId, comment, createdByBookingUser,
      } = checked;
      const row = await context.executeSingleResultQuery(bookRequestQueries.createBookRequest, stringifyParams(bookDataId, userId, userBookingId, comment, createdByBookingUser));
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
};
