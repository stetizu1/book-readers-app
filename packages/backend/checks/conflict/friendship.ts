import { FriendshipCreate } from 'book-app-shared/types/Friendship';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { ConflictErrorMessage } from '../../constants/ErrorMessages';

import { ConflictError } from '../../types/http-errors/ConflictError';
import { Transaction } from '../../types/transaction/Transaction';

import { convertDbRowToFriendship } from '../../db/transformations/friendshipTransformation';
import { friendshipQueries } from '../../db/queries/friendshipQueries';


interface CheckConflictFriendship {
  create: (context: Transaction, loggedUserId: number, friendshipCreate: FriendshipCreate) => Promise<boolean>;
}

export const checkConflictFriendship: CheckConflictFriendship = {
  create: async (context, loggedUserId, friendshipCreate) => {
    const { toUserId } = friendshipCreate;
    if (loggedUserId === toUserId) {
      throw new ConflictError(ConflictErrorMessage.friendSameIdGiven);
    }

    const friendship = await context.executeSingleOrNoResultQuery(
      convertDbRowToFriendship,
      friendshipQueries.getFriendshipByIds, loggedUserId, toUserId,
    );
    // if already exists
    if (!isNull(friendship)) {
      throw new ConflictError(ConflictErrorMessage.friendExists);
    }
    return true;
  },


};
