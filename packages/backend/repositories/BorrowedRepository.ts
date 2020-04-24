import { Borrowed } from 'book-app-shared/types/Borrowed';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkBorrowedCreate, checkBorrowedUpdate } from '../checks/borrowedCheck';
import { borrowedQueries } from '../db/queries/borrowedQueries';
import {
  createBorrowedFromDbRow,
  transformBorrowedUpdateFromBorrowed,
} from '../db/transformations/borrowedTransformation';


interface BorrowedRepository extends Repository {
  createBorrowed: CreateActionWithContext<Borrowed>;
  readBorrowedById: ReadActionWithContext<Borrowed>;
  readAllBorrowed: ReadAllActionWithContext<Borrowed>;
  updateBorrowed: UpdateActionWithContext<Borrowed>;
  deleteBorrowed: DeleteActionWithContext<Borrowed>;
}

export const borrowedRepository: BorrowedRepository = {
  name: RepositoryName.borrowed,

  createBorrowed: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(borrowedRepository.name, body);

    const { checked, checkError } = checkBorrowedCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    // todo add can not borrow to yourself (userBorrowedId !== you)
    // todo add can not borrow your own book (bookData.userId !== you)

    try {
      const {
        bookDataId, userBorrowedId, nonUserName, comment, until,
      } = checked;
      const row = await context.executeSingleResultQuery(borrowedQueries.createBorrowed, bookDataId, userBorrowedId, nonUserName, comment, until, new Date());
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBorrowedById: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(borrowedRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(borrowedQueries.getBorrowedById, bookDataId);
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBorrowed: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(borrowedRepository.name);

    try {
      const rows = await context.executeQuery(borrowedQueries.getAllBorrowed);
      return createArrayFromDbRows(rows, createBorrowedFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBorrowed: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(borrowedRepository.name, id, body);

    const { checked, checkError } = checkBorrowedUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await borrowedRepository.readBorrowedById(context, loggedUserId, id);
      const currentData = transformBorrowedUpdateFromBorrowed(current);

      // todo add can not borrow to yourself (userBorrowedId !== you)
      // todo add can not borrow your own book (bookData.userId !== you)

      const mergedUpdateData = merge(currentData, checked);

      const {
        returned, userBorrowedId, nonUserName, comment, until,
      } = mergedUpdateData;
      const row = await context.executeSingleResultQuery(borrowedQueries.updateBorrowed, id, returned, userBorrowedId, nonUserName, comment, until);
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBorrowed: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(borrowedRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(borrowedQueries.deleteBorrowed, id);
      return createBorrowedFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
