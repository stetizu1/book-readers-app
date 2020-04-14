import { BookRequest } from 'book-app-shared/types/BookRequest';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/getHttpError';

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
}
