import { Friendship } from 'book-app-shared/types/Friendship';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';
import { ConflictErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';
import { ConflictError } from '../types/http_errors/ConflictError';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkParameterId } from '../checks/other/checkParameterId';
import { checkFriendshipCreate, checkFriendshipUpdate } from '../checks/friendshipChecks';
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
    try {
      const checked = checkFriendshipCreate(body);
      // check for both directions
      const friendship = await context.executeSingleOrNoResultQuery(
        convertDbRowToFriendship,
        friendshipQueries.getFriendshipByIds, checked.fromUserId, checked.toUserId,
      );
      if (!isNull(friendship)) {
        throw new ConflictError(ConflictErrorMessage.friendExists);
      }

      const row = await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.createFriendship, checked.fromUserId, checked.toUserId);
      return convertDbRowToFriendship(row);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(friendshipRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readFriendshipById: async (context, loggedUserId, id) => {
    try {
      checkParameterId(id);
      return await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.getFriendshipByIds, loggedUserId, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(friendshipRepository.name, id);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllFriendships: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToFriendship, friendshipQueries.getAllFriendships, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(friendshipRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateFriendship: async (context, loggedUserId, id, body) => {
    try {
      checkParameterId(id);
      const friendshipUpdate = checkFriendshipUpdate(body);
      const { confirmed } = friendshipUpdate;
      return await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.updateFriendship, loggedUserId, id, confirmed);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(friendshipRepository.name, id, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteFriendship: async (context, loggedUserId, id) => {
    try {
      checkParameterId(id);
      return await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.deleteFriendship, loggedUserId, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(friendshipRepository.name, id);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
