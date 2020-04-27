import { Borrowed } from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { CheckResultMessage, PathErrorMessage } from '../constants/ErrorMessages';

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
import { merge } from '../helpers/db/merge';

import { checkBorrowedCreate, checkBorrowedUpdate } from '../checks/borrowedCheck';
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
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(borrowedRepository.name, body);

    const checked = checkBorrowedCreate(body, errPrefix, errPostfix);

    if (checked.userBorrowedId === loggedUserId) {
      return Promise.reject(getHttpError.getInvalidParametersError(CheckResultMessage.borrowSameIdGiven, errPrefix, errPostfix));
    }

    try {
      const {
        bookDataId, userBorrowedId, nonUserName, comment, until,
      } = checked;
      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      if (bookData.userId !== loggedUserId) {
        return Promise.reject(getHttpError.getInvalidParametersError(CheckResultMessage.borrowNotYourBook, errPrefix, errPostfix));
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
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBorrowedById: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(borrowedRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      const borrowed = await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.getBorrowedById, bookDataId);
      if (bookData.userId !== loggedUserId && borrowed.userBorrowedId !== loggedUserId) {
        return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
      }
      return borrowed;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBorrowedFromUser: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(borrowedRepository.name);

    try {
      return await context.executeQuery(convertDbRowToBorrowed, borrowedQueries.getAllBorrowed, loggedUserId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBorrowed: async (context, loggedUserId, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(borrowedRepository.name, bookDataId, body);

    const checked = checkBorrowedUpdate(body, errPrefix, errPostfix);
    const checkedUserBorrowedId = checked.userBorrowedId;

    if (checkedUserBorrowedId === loggedUserId) {
      return Promise.reject(getHttpError.getInvalidParametersError(CheckResultMessage.borrowSameIdGiven, errPrefix, errPostfix));
    }

    try {
      const current = await borrowedRepository.readBorrowedById(context, loggedUserId, bookDataId);
      const currentData = convertBorrowedToBorrowedUpdate(current);

      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      if (bookData.userId !== loggedUserId) {
        return Promise.reject(getHttpError.getInvalidParametersError(CheckResultMessage.borrowNotYourBook, errPrefix, errPostfix));
      }
      if (!isUndefined.or(isNull)(checkedUserBorrowedId)) {
        await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, checkedUserBorrowedId);
      }

      const mergedUpdateData = merge(currentData, checked);

      const {
        returned, userBorrowedId, nonUserName, comment, until,
      } = mergedUpdateData;
      return await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.updateBorrowed, bookDataId, returned, userBorrowedId, nonUserName, comment, until);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBorrowed: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(borrowedRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
      if (bookData.userId !== loggedUserId) {
        return Promise.reject(getHttpError.getInvalidParametersError(CheckResultMessage.borrowNotYourBook, errPrefix, errPostfix));
      }
      return await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.deleteBorrowed, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
