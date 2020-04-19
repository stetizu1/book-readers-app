import {
  FriendshipCreate,
  FriendshipUpdate,
  isFriendshipCreate,
  isFriendshipUpdate,
} from 'book-app-shared/types/Friendship';
import { isValidId } from 'book-app-shared/helpers/validators';

import {
  INVALID_ID,
  INVALID_STRUCTURE,
  FRIEND_SAME_ID_GIVEN,
  FRIEND_INVALID_UNCONFIRM,
} from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


export const checkFriendshipCreate: CheckFunction<FriendshipCreate> = (body, errPrefix, errPostfix) => {
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

export const checkFriendshipUpdate: CheckFunction<FriendshipUpdate> = (body, errPrefix, errPostfix) => {
  if (!isFriendshipUpdate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  if (!body.confirmed) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, FRIEND_INVALID_UNCONFIRM),
    };
  }

  return {
    checked: normalizeUpdateObject(body),
  };
};
