import { FriendshipCreate, isFriendshipCreate } from 'book-app-shared/types/Friendship';

import { INVALID_ID, INVALID_STRUCTURE, FRIEND_SAME_ID_GIVEN } from '../constants/errorMessages';
import { isValidId } from '../helpers/validators';
import { getHttpError } from '../helpers/getHttpError';


export const checkFriendshipCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<FriendshipCreate> => {
  if (!isFriendshipCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.fromUserId) || !isValidId(body.toUserId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (body.fromUserId === body.toUserId) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, FRIEND_SAME_ID_GIVEN),
    };
  }

  return {
    checked: body,
  };
};
