import { Borrowed } from 'book-app-shared/types/Borrowed';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';

import { checkBorrowedCreate } from '../checks/borrowedCheck';
import { BorrowedQueries } from '../db/queries/BorrowedQueries';
import { createBorrowedFromDbRow } from '../db/transformations/borrowedTransformation';


export class BorrowedRepository {
  static REPO_NAME = 'Borrow';

  static createBorrowed: CreateActionWithContext<Borrowed> = async (context, body) => {
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

  static readBorrowedById: ReadActionWithContext<Borrowed> = async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BorrowedRepository.REPO_NAME, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(BorrowedQueries.getBorrowedByBookDataId, stringifyParams(id));
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAllBorrowed: ReadAllActionWithContext<Borrowed> = async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BorrowedRepository.REPO_NAME, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(BorrowedQueries.getAllBorrowed);

      return await Promise.all(
        rows.map((row) => createBorrowedFromDbRow(row)),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
