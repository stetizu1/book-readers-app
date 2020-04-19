import { isReviewCreate, ReviewCreate } from 'book-app-shared/types/Review';
import { isValidId, isValidStars } from 'book-app-shared/helpers/validators';

import { INVALID_ID, INVALID_STARS, INVALID_STRUCTURE } from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


export const checkReviewCreate: CheckFunction<ReviewCreate> = (body, errPrefix, errPostfix) => {
  if (!isReviewCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.bookDataId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (body.stars !== undefined && !isValidStars(body.stars)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STARS),
    };
  }

  // switch possibly empty to undefined
  return {
    checked: normalizeCreateObject(body),
  };
};
