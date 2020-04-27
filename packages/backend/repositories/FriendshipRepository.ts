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

import { checkFriendshipCreate, checkFriendshipUpdate } from '../checks/friendshipCheck';
import { friendshipQueries } from '../db/queries/friendshipQueries';
import { convertDbRowToFriendship } from '../db/transformations/friendshipTransformation';


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

    const checked = checkFriendshipCreate(body, errPrefix, errPostfix);

    try {
      const friendship = await context.executeSingleOrNoResultQuery(convertDbRowToFriendship, friendshipQueries.getFriendshipByIds, checked.fromUserId, checked.toUserId); // check for both directions
      if (!isNull(friendship)) {
        return Promise.reject(getHttpError.getConflictError(ConflictErrorMessage.friendExists, errPrefix, errPostfix));
      }

      const row = await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.createFriendship, checked.fromUserId, checked.toUserId);
      return convertDbRowToFriendship(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readFriendshipById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(friendshipRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.getFriendshipByIds, loggedUserId, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllFriendships: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(friendshipRepository.name);

    try {
      return await context.executeQuery(convertDbRowToFriendship, friendshipQueries.getAllFriendships);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateFriendship: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(friendshipRepository.name, id, body);

    const checked = checkFriendshipUpdate(body, errPrefix, errPostfix);

    try {
      const { confirmed } = checked;
      return await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.updateFriendship, loggedUserId, id, confirmed);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteFriendship: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(friendshipRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.deleteFriendship, loggedUserId, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
