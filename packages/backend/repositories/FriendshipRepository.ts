import { Friendship } from 'book-app-shared/types/Friendship';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';

import { friendshipQueries } from '../db/queries/friendshipQueries';
import { createFriendshipFromDbRow } from '../db/transformations/friendshipTransformation';
import { checkFriendshipCreate } from '../checks/friendshipCheck';


interface FriendshipRepository extends Repository {
  createFriendship: CreateActionWithContext<Friendship>;
  readFriendshipById: ReadActionWithContext<Friendship>;
  readAllFriendships: ReadAllActionWithContext<Friendship>;
}

export const friendshipRepository: FriendshipRepository = {
  name: 'Friendship',

  createFriendship: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(friendshipRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkFriendshipCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(friendshipQueries.createFriendship, stringifyParams(checked.fromUserId, checked.toUserId));
      return createFriendshipFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readFriendshipById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(friendshipRepository.name, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(friendshipQueries.getFriendshipByIds, stringifyParams(id, 1)); // todo use logged-in user id
      return createFriendshipFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllFriendships: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(friendshipRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(friendshipQueries.getAllFriendships);

      return createArrayFromDbRows(rows, createFriendshipFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
