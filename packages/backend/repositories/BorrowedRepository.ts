import { Borrowed } from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';
import { CheckResultMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';
import { InvalidParametersError } from '../types/http_errors/InvalidParametersError';
import { ForbiddenError } from '../types/http_errors/ForbiddenError';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkBorrowedCreate, checkBorrowedUpdate } from '../checks/body/borrowed';
import { borrowedQueries } from '../db/queries/borrowedQueries';
import {
  convertDbRowToBorrowed,
  convertBorrowedToBorrowedUpdate,
} from '../db/transformations/borrowedTransformation';

import { convertDbRowToBookData } from '../db/transformations/bookDataTransformation';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import { friendshipQueries } from '../db/queries/friendshipQueries';


interface BorrowedRepository extends Repository {
  createBorrowed: CreateActionWithContext<Borrowed>;
  readBorrowedById: ReadActionWithContext<Borrowed>;
  readAllBorrowedFromUser: ReadAllActionWithContext<Borrowed>;
  updateBorrowed: UpdateActionWithContext<Borrowed>;
  deleteBorrowed: DeleteActionWithContext<Borrowed>;
}

export const borrowedRepository: BorrowedRepository = {
  name: RepositoryName.borrowed,

  createBorrowed: async (context, loggedUserId, body) => {
    try {
      const borrowedCreate = checkBorrowedCreate(body);
      if (borrowedCreate.userBorrowedId === loggedUserId) {
        throw new InvalidParametersError(CheckResultMessage.borrowSameIdGiven);
      }
      const {
        bookDataId, userBorrowedId, nonUserName, comment, until,
      } = borrowedCreate;
      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      if (bookData.userId !== loggedUserId) {
        throw new InvalidParametersError(CheckResultMessage.borrowNotYourBook);
      }
      if (!isUndefined(userBorrowedId)) {
        await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userBorrowedId);
      }

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

  readBorrowedById: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      const borrowed = await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.getBorrowedById, bookDataId);
      if (bookData.userId !== loggedUserId && borrowed.userBorrowedId !== loggedUserId) {
        throw new ForbiddenError();
      }
      return borrowed;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(borrowedRepository.name, bookDataId);
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

  updateBorrowed: async (context, loggedUserId, bookDataId, body) => {
    try {
      checkParameterId(bookDataId);
      const borrowedUpdate = checkBorrowedUpdate(body);
      const checkedUserBorrowedId = borrowedUpdate.userBorrowedId;

      if (checkedUserBorrowedId === loggedUserId) {
        throw new InvalidParametersError(CheckResultMessage.borrowSameIdGiven);
      }


      const current = await borrowedRepository.readBorrowedById(context, loggedUserId, bookDataId);
      const currentData = convertBorrowedToBorrowedUpdate(current);

      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      if (bookData.userId !== loggedUserId) {
        throw new InvalidParametersError(CheckResultMessage.borrowNotYourBook);
      }
      if (!isUndefined.or(isNull)(checkedUserBorrowedId)) {
        await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, checkedUserBorrowedId);
      }

      const mergedUpdateData = merge(currentData, borrowedUpdate);

      const {
        returned, userBorrowedId, nonUserName, comment, until,
      } = mergedUpdateData;
      return await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.updateBorrowed, bookDataId, returned, userBorrowedId, nonUserName, comment, until);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(borrowedRepository.name, bookDataId, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBorrowed: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      if (bookData.userId !== loggedUserId) {
        throw new InvalidParametersError(CheckResultMessage.borrowNotYourBook);
      }
      return await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.deleteBorrowed, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(borrowedRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
