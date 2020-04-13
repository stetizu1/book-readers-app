import { Friendship } from 'book-app-shared/types/Friendship';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';

import { FriendshipQueries } from '../db/queries/FriendshipQueries';
import { createFriendshipFromDbRow } from '../db/transformations/friendshipTransformation';
import { checkFriendshipCreate } from '../checks/friendshipCheck';
import { processTransactionError } from '../helpers/getHttpError';


export class FriendshipRepository {
  static REPO_NAME = 'Friendship';

  static createFriendship: CreateActionWithContext<Friendship> = async (context, body): Promise<Friendship> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(FriendshipRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkFriendshipCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const params = stringifyParams(checked.fromUserId, checked.toUserId);

    try {
      const row = await context.transaction.executeSingleResultQuery(FriendshipQueries.createFriendship, params);
      return createFriendshipFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
