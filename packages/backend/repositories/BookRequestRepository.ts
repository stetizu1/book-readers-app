import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError, processTransactionError } from '../helpers/getHttpError';

import { BookRequestQueries } from '../db/queries/BookRequestQueries';
import { createBookRequestFromDbRow } from '../db/transformations/bookRequestTransformation';
import { checkBookRequestCreate } from '../checks/bookRequestCheck';


export class BookRequestRepository {
  static REPO_NAME = 'BookRequest';

  static createBookRequest: CreateActionWithContext<BookRequest> = async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookRequestRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBookRequestCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const {
        bookDataId, userId, userBookingId, comment, createdByBookingUser,
      } = checked;
      const row = await context.transaction.executeSingleResultQuery(BookRequestQueries.createBookRequest, stringifyParams(bookDataId, userId, userBookingId, comment, createdByBookingUser));
      return createBookRequestFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readBookRequestById: ReadActionWithContext<BookRequest> = async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookRequestRepository.REPO_NAME, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleOrNoResultQuery(BookRequestQueries.getBookRequestByBookDataId, stringifyParams(id));
      if (row) {
        return createBookRequestFromDbRow(row);
      }
      return Promise.reject(getHttpError.getNotFoundError(errPrefix, errPostfix));
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAllBookRequests: ReadAllActionWithContext<BookRequest> = async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookRequestRepository.REPO_NAME, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(BookRequestQueries.getAllBookRequests);

      return await Promise.all(
        rows.map((row) => createBookRequestFromDbRow(row)),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
