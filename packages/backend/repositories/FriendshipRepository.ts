import { Friendship } from 'book-app-shared/types/Friendship';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkFriendshipCreate, checkFriendshipUpdate } from '../checks/invalid/friendship';
import { friendshipQueries } from '../db/queries/friendshipQueries';
import { convertDbRowToFriendship } from '../db/transformations/friendshipTransformation';
import { checkConflictFriendship } from '../checks/conflict/friendship';


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
      const friendshipCreate = checkFriendshipCreate(body);
      await checkConflictFriendship.create(context, loggedUserId, friendshipCreate);
      const row = await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.createFriendship, loggedUserId, friendshipCreate.toUserId);
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
      return await context.executeSingleResultQuery(convertDbRowToFriendship, friendshipQueries.updateFriendship, loggedUserId, id, friendshipUpdate.confirmed);
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
