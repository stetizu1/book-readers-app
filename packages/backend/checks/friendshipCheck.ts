import {
  FriendshipCreate,
  FriendshipUpdate,
  isFriendshipCreate,
  isFriendshipUpdate,
} from 'book-app-shared/types/Friendship';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/checks/constructCheckResult';


const checkCreate: MessageCheckFunction<FriendshipCreate> = (body) => {
  const { fromUserId, toUserId } = body;
  if (!isValidId(fromUserId) || !isValidId(toUserId)) {
    return CheckResultMessage.invalidId;
  }
  if (fromUserId === toUserId) {
    return CheckResultMessage.friendSameIdGiven;
  }
  return CheckResultMessage.success;
};

const checkUpdate: MessageCheckFunction<FriendshipUpdate> = (body) => {
  const { confirmed } = body;
  if (!confirmed) {
    return CheckResultMessage.friendInvalidConfirm;
  }
  return CheckResultMessage.success;
};

export const checkFriendshipCreate: CheckFunction<FriendshipCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isFriendshipCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};


export const checkFriendshipUpdate: CheckFunction<FriendshipUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isFriendshipUpdate(normalized)) {
    return constructCheckResult(normalized, checkUpdate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
