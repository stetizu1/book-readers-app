import {
  isLabelCreate, isLabelUpdate, LabelCreate, LabelUpdate,
} from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkCreate, checkUpdate } from '../helpers/checks/constructCheckResult';


const checkCreateWithMessage: MessageCheckFunction<LabelCreate> = (body) => {
  const { userId } = body;
  if (!isValidId(userId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkLabelCreate: CheckFunction<LabelCreate> = (body, errPrefix, errPostfix) => (
  checkCreate(isLabelCreate, checkCreateWithMessage, body, errPrefix, errPostfix)
);

export const checkLabelUpdate: CheckFunction<LabelUpdate> = (body, errPrefix, errPostfix) => (
  checkUpdate(isLabelUpdate, undefined, body, errPrefix, errPostfix)
);
