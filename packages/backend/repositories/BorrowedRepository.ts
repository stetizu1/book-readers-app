import { Borrowed } from 'book-app-shared/types/Borrowed';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/getHttpError';

import { BorrowedQueries } from '../db/queries/BorrowedQueries';
import { createBorrowedFromDbRow } from '../db/transformations/borrowedTransformation';
import { checkBorrowedCreate } from '../checks/borrowedCheck';


export class BorrowedRepository {
  static REPO_NAME = 'Borrow';

  static createBorrowed: CreateActionWithContext<Borrowed> = async (context, body): Promise<Borrowed> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BorrowedRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBorrowedCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const {
        userId, bookDataId, userBorrowedId, nonUserName, comment, until,
      } = checked;
      const row = await context.transaction.executeSingleResultQuery(BorrowedQueries.createBorrowed, stringifyParams(userId, bookDataId, userBorrowedId, nonUserName, comment, until, new Date()));
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
