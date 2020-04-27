import {
  FriendshipCreate,
  FriendshipUpdate,
  isFriendshipCreate,
  isFriendshipUpdate,
} from 'book-app-shared/types/Friendship';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


const checkCreate: CheckFunction<FriendshipCreate> = (body) => {
  const { fromUserId, toUserId } = body;
  if (!isValidId(fromUserId) || !isValidId(toUserId)) {
    return CheckResultMessage.invalidId;
  }
  if (fromUserId === toUserId) {
    return CheckResultMessage.friendSameIdGiven;
  }
  return CheckResultMessage.success;
};

const checkUpdate: CheckFunction<FriendshipUpdate> = (body) => {
  const { confirmed } = body;
  if (!confirmed) {
    return CheckResultMessage.friendInvalidConfirm;
  }
  return CheckResultMessage.success;
};

export const checkFriendshipCreate: ExportedCheckFunction<FriendshipCreate> = (body) => (
  executeCheckCreate(body, isFriendshipCreate, checkCreate)
);


export const checkFriendshipUpdate: ExportedCheckFunction<FriendshipUpdate> = (body) => (
  executeCheckUpdate(body, isFriendshipUpdate, checkUpdate)
);
