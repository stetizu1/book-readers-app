import {
  isLabelCreate, isLabelUpdate, LabelCreate, LabelUpdate,
} from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


const checkCreate: CheckFunction<LabelCreate> = (body) => {
  const { userId } = body;
  if (!isValidId(userId)) {
    return InvalidParametersErrorMessage.invalidId;
  }
  return Success.checkSuccess;
};

export const checkLabelCreate: ExportedCheckFunction<LabelCreate> = (body) => (
  executeCheckCreate(body, isLabelCreate, checkCreate)
);

export const checkLabelUpdate: ExportedCheckFunction<LabelUpdate> = (body) => (
  executeCheckUpdate(body, isLabelUpdate)
);
