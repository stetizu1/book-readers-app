import { Borrowed } from 'book-app-shared/types/Borrowed';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';
import { createArrayFromDbRows } from '../db/createFromDbRow';

import { checkBorrowedCreate } from '../checks/borrowedCheck';
import { borrowedQueries } from '../db/queries/borrowedQueries';
import { createBorrowedFromDbRow } from '../db/transformations/borrowedTransformation';


interface BorrowedRepository extends Repository {
  createBorrowed: CreateActionWithContext<Borrowed>;
  readBorrowedByBookDataId: ReadActionWithContext<Borrowed>;
  readAllBorrowed: ReadAllActionWithContext<Borrowed>;
}

export const borrowedRepository: BorrowedRepository = {
  name: 'Borrow',

  createBorrowed: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(borrowedRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBorrowedCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const {
        userId, bookDataId, userBorrowedId, nonUserName, comment, until,
      } = checked;
      const row = await context.transaction.executeSingleResultQuery(borrowedQueries.createBorrowed, stringifyParams(userId, bookDataId, userBorrowedId, nonUserName, comment, until, new Date()));
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBorrowedByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(borrowedRepository.name, ErrorMethod.Read, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(borrowedQueries.getBorrowedByBookDataId, stringifyParams(bookDataId));
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBorrowed: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(borrowedRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(borrowedQueries.getAllBorrowed);
      return createArrayFromDbRows(rows, createBorrowedFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
