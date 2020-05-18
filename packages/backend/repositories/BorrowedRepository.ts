import { Borrowed } from 'book-app-shared/types/Borrowed';
import { convertBorrowedToBorrowedUpdate } from 'book-app-shared/helpers/convert-to-update/borrowed';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/string-helpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkBorrowedCreate, checkBorrowedUpdate } from '../checks/invalid/borrowed';
import { borrowedQueries } from '../db/queries/borrowedQueries';
import {
  convertDbRowToBorrowed,
} from '../db/transformations/borrowedTransformation';

import { checkConflictBorrowed } from '../checks/conflict/borrowed';
import { checkPermissionBorrowed } from '../checks/forbidden/borrowed';


interface BorrowedRepository extends Repository {
  createBorrowed: CreateActionWithContext<Borrowed>;
  readBorrowedById: ReadActionWithContext<Borrowed>;
  readAllBorrowedFromUser: ReadAllActionWithContext<Borrowed>;
  readAllBorrowedToUser: ReadAllActionWithContext<Borrowed>;
  updateBorrowed: UpdateActionWithContext<Borrowed>;
  deleteBorrowed: DeleteActionWithContext<Borrowed>;
}

export const borrowedRepository: BorrowedRepository = {
  name: RepositoryName.borrowed,

  createBorrowed: async (context, loggedUserId, body) => {
    try {
      const borrowedCreate = checkBorrowedCreate(body);
      await checkConflictBorrowed.create(context, loggedUserId, borrowedCreate);
      await checkPermissionBorrowed.create(context, loggedUserId, borrowedCreate);
      const {
        bookDataId, userBorrowedId, nonUserName, comment, until,
      } = borrowedCreate;

      return await context.executeSingleResultQuery(
        convertDbRowToBorrowed,
        borrowedQueries.createBorrowed,
        bookDataId, userBorrowedId, nonUserName, comment, until, new Date(),
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(borrowedRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBorrowedById: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      const borrowed = await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.getBorrowedById, id);
      await checkPermissionBorrowed.read(context, loggedUserId, borrowed);
      return borrowed;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(borrowedRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBorrowedFromUser: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToBorrowed, borrowedQueries.getAllBorrowed, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(borrowedRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBorrowedToUser: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToBorrowed, borrowedQueries.getAllBorrowedToUser, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(borrowedRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBorrowed: async (context, loggedUserId, param, body) => {
    try {
      const id = checkParameterId(param);
      const borrowedUpdate = checkBorrowedUpdate(body);
      await checkConflictBorrowed.update(context, loggedUserId, borrowedUpdate, id);
      await checkPermissionBorrowed.update(context, loggedUserId, borrowedUpdate);

      const current = await borrowedRepository.readBorrowedById(context, loggedUserId, id);
      const currentData = convertBorrowedToBorrowedUpdate(current);
      const mergedUpdateData = merge(currentData, borrowedUpdate);

      const {
        returned, userBorrowedId, nonUserName, comment, until,
      } = mergedUpdateData;
      return await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.updateBorrowed, id, returned, userBorrowedId, nonUserName, comment, until);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(borrowedRepository.name, param, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBorrowed: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      await checkConflictBorrowed.delete(context, loggedUserId, id);
      return await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.deleteBorrowed, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(borrowedRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
