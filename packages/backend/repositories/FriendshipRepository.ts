import { Friendship } from 'book-app-shared/types/Friendship';

import { CreateActionWithContext } from '../constants/actionTypes';
import {
  composeMessage, addRepoPrefix,
  CREATE_ERROR, INVALID_STRUCTURE, STRUCTURE_GIVEN, FOREIGN_KEY_VIOLATION,
} from '../constants/errorMessages';
import { isForeignKeyViolation } from '../db/errors';
import { ConflictError } from '../httpErrors/ConflictError';
import { InvalidParametersError } from '../httpErrors/InvalidParametersError';
import { stringifyParams } from '../helpers/stringifyParams';

import { FriendshipQueries } from '../db/queries/FriendshipQueries';
import { createFriendshipFromDbRow } from '../db/transformations/friendshipTransformation';
import { checkFriendshipCreate } from '../checks/friendshipCheck';


export class FriendshipRepository {
  static REPO_NAME = 'Friendship';

  static createFriendship: CreateActionWithContext<Friendship> = async (context, body): Promise<Friendship> => {
    const errPrefix = `${addRepoPrefix(FriendshipRepository.REPO_NAME)} ${CREATE_ERROR}`;
    const errPostfix = `${STRUCTURE_GIVEN} ${JSON.stringify(body)}`;

    const { checked, message } = checkFriendshipCreate(body);
    if (!checked) return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, message, errPostfix)));

    const params = stringifyParams(checked.fromUserId, checked.toUserId);

    try {
      const row = await context.transaction.executeSingleResultQuery(FriendshipQueries.createFriendship, params);
      return createFriendshipFromDbRow(row);
    } catch (error) {
      console.error(error, error.message);

      if (isForeignKeyViolation(error)) {
        return Promise.reject(new ConflictError(composeMessage(errPrefix, FOREIGN_KEY_VIOLATION, errPostfix)));
      }
      return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, INVALID_STRUCTURE, errPostfix)));
    }
  };
}
