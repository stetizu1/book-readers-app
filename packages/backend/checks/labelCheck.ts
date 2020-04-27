import {
  isLabelCreate, isLabelUpdate, LabelCreate, LabelUpdate,
} from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../helpers/checks/constructCheckResult';


const checkCreate: CheckFunction<LabelCreate> = (body) => {
  const { userId } = body;
  if (!isValidId(userId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkLabelCreate: ExportedCheckFunction<LabelCreate> = (body, errPrefix, errPostfix) => (
  executeCheckCreate(body, errPrefix, errPostfix, isLabelCreate, checkCreate)
);

export const checkLabelUpdate: ExportedCheckFunction<LabelUpdate> = (body, errPrefix, errPostfix) => (
  executeCheckUpdate(body, errPrefix, errPostfix, isLabelUpdate)
);
