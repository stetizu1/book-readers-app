import { isLabelCreate, LabelCreate } from 'book-app-shared/types/Label';

import { INVALID_ID, INVALID_STRUCTURE } from '../constants/errorMessages';
import { isValidId } from '../helpers/validators';
import { getHttpError } from '../helpers/getHttpError';


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

  // switch possibly empty strings to undefined
  return {
    checked: {
      ...body,
      description: body.description || undefined,
    },
  };
};
