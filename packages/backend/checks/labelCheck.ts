import {
  isLabelCreate, isLabelUpdate, LabelCreate, LabelUpdate,
} from 'book-app-shared/types/Label';
import { isValidId, isValidName } from 'book-app-shared/helpers/validators';

import { EMPTY_STRING, INVALID_ID, INVALID_STRUCTURE } from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


export const checkLabelCreate: CheckFunction<LabelCreate> = (body, errPrefix, errPostfix) => {
  if (!isLabelCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.userId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (!isValidName(body.name)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, EMPTY_STRING),
    };
  }

  return {
    checked: normalizeCreateObject(body),
  };
};

export const checkLabelUpdate: CheckFunction<LabelUpdate> = (body, errPrefix, errPostfix) => {
  if (!isLabelUpdate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  return {
    checked: normalizeUpdateObject(body),
  };
};
