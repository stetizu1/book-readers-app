import {
  FriendshipCreate,
  FriendshipUpdate,
  isFriendshipCreate,
  isFriendshipUpdate,
} from 'book-app-shared/types/Friendship';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkCreate, checkUpdate } from '../helpers/checks/constructCheckResult';


const checkCreateWithMessage: MessageCheckFunction<FriendshipCreate> = (body) => {
  const { fromUserId, toUserId } = body;
  if (!isValidId(fromUserId) || !isValidId(toUserId)) {
    return CheckResultMessage.invalidId;
  }
  if (fromUserId === toUserId) {
    return CheckResultMessage.friendSameIdGiven;
  }
  return CheckResultMessage.success;
};

const checkUpdateWithMessage: MessageCheckFunction<FriendshipUpdate> = (body) => {
  const { confirmed } = body;
  if (!confirmed) {
    return CheckResultMessage.friendInvalidConfirm;
  }
  return CheckResultMessage.success;
};

export const checkFriendshipCreate: CheckFunction<FriendshipCreate> = (body, errPrefix, errPostfix) => (
  checkCreate(isFriendshipCreate, checkCreateWithMessage, body, errPrefix, errPostfix)
);


export const checkFriendshipUpdate: CheckFunction<FriendshipUpdate> = (body, errPrefix, errPostfix) => (
  checkUpdate(isFriendshipUpdate, checkUpdateWithMessage, body, errPrefix, errPostfix)
);
