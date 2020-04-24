import { Friendship } from 'book-app-shared/types/Friendship';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ConflictErrorMessage, PathErrorMessage } from '../constants/ErrorMessages';

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

import { checkFriendshipCreate, checkFriendshipUpdate } from '../checks/friendshipCheck';
import { friendshipQueries } from '../db/queries/friendshipQueries';
import { createFriendshipFromDbRow } from '../db/transformations/friendshipTransformation';


interface FriendshipRepository extends Repository {
  createFriendship: CreateActionWithContext<Friendship>;
  readFriendshipById: ReadActionWithContext<Friendship>;
  readAllFriendships: ReadAllActionWithContext<Friendship>;
  updateFriendship: UpdateActionWithContext<Friendship>;
  deleteFriendship: DeleteActionWithContext<Friendship>;
}

export const friendshipRepository: FriendshipRepository = {
  name: RepositoryName.friendship,

  createFriendship: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(friendshipRepository.name, body);

    const { checked, checkError } = checkFriendshipCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const friendship = await context.executeSingleOrNoResultQuery(friendshipQueries.getFriendshipByIds, checked.fromUserId, checked.toUserId); // check for both directions
      if (!isNull(friendship)) {
        return Promise.reject(getHttpError.getConflictError(errPrefix, errPostfix, ConflictErrorMessage.friendExists));
      }

      const row = await context.executeSingleResultQuery(friendshipQueries.createFriendship, checked.fromUserId, checked.toUserId);
      return createFriendshipFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readFriendshipById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(friendshipRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(friendshipQueries.getFriendshipByIds, loggedUserId, id);
      return createFriendshipFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllFriendships: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(friendshipRepository.name);

    try {
      const rows = await context.executeQuery(friendshipQueries.getAllFriendships);

      return createArrayFromDbRows(rows, createFriendshipFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateFriendship: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(friendshipRepository.name, id, body);

    const { checked, checkError } = checkFriendshipUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const { confirmed } = checked;
      const row = await context.executeSingleResultQuery(friendshipQueries.updateFriendship, loggedUserId, id, confirmed);
      return createFriendshipFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteFriendship: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(friendshipRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(friendshipQueries.deleteFriendship, loggedUserId, id);
      return createFriendshipFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
