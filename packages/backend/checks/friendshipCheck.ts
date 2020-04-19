import {
  FriendshipCreate,
  FriendshipUpdate,
  isFriendshipCreate,
  isFriendshipUpdate,
} from 'book-app-shared/types/Friendship';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/constructCheckResult';


const checkCreate: MessageCheckFunction<FriendshipCreate> = (body) => {
  const { fromUserId, toUserId } = body;
  if (!isValidId(fromUserId) || !isValidId(toUserId)) {
    return CheckResultValue.invalidId;
  }
  if (fromUserId === toUserId) {
    return CheckResultValue.friendSameIdGiven;
  }
  return CheckResultValue.success;
};

const checkUpdate: MessageCheckFunction<FriendshipUpdate> = (body) => {
  const { confirmed } = body;
  if (!confirmed) {
    return CheckResultValue.friendInvalidConfirm;
  }
  return CheckResultValue.success;
};

export const checkFriendshipCreate: CheckFunction<FriendshipCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isFriendshipCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};


export const checkFriendshipUpdate: CheckFunction<FriendshipUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isFriendshipUpdate(normalized)) {
    return constructCheckResult(normalized, checkUpdate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
