import { FriendshipCreate, isFriendshipCreate } from 'book-app-shared/types/Friendship';

import { INVALID_ID, INVALID_STRUCTURE, FRIEND_SAME_ID_GIVEN } from '../constants/errorMessages';
import { isValidId } from '../helpers/validators';


export const checkFriendshipCreate = (body: unknown): CheckResult<FriendshipCreate> => {
  if (!isFriendshipCreate(body)) {
    return {
      checked: false,
      message: `${INVALID_STRUCTURE}`,
    };
  }
  if (!isValidId(body.fromUserId) || !isValidId(body.toUserId)) {
    return {
      checked: false,
      message: `${INVALID_ID}`,
    };
  }

  if (body.fromUserId === body.toUserId) {
    return {
      checked: false,
      message: `${FRIEND_SAME_ID_GIVEN}`,
    };
  }

  return {
    checked: body,
  };
};
