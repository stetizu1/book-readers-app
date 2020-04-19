import { HasLabelCreate, isHasLabelCreate } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import {
  INVALID_ID,
  INVALID_STRUCTURE,
} from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


export const checkHasLabelCreate: CheckFunction<HasLabelCreate> = (body, errPrefix, errPostfix) => {
  if (!isHasLabelCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.bookDataId) || !isValidId(body.labelId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  return {
    checked: normalizeCreateObject(body),
  };
};
