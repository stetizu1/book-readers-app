import { HasLabelCreate, isHasLabelCreate } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import {
  INVALID_ID,
  INVALID_STRUCTURE,
} from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';


export const checkHasLabelCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<HasLabelCreate> => {
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
    checked: body,
  };
};
