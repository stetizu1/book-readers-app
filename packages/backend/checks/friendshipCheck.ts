import { FriendshipCreate, isFriendshipCreate } from 'book-app-shared/types/Friendship';
import { isValidId } from 'book-app-shared/helpers/validators';

import { INVALID_ID, INVALID_STRUCTURE, FRIEND_SAME_ID_GIVEN } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


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
    checked: normalizeCreateObject(body),
  };
};
