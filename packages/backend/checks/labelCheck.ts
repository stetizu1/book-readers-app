import { isLabelCreate, LabelCreate } from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { INVALID_ID, INVALID_STRUCTURE } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


export const checkLabelCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<LabelCreate> => {
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

  // switch possibly empty to undefined
  return {
    checked: normalizeCreateObject(body),
  };
};
