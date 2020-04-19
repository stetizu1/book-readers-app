import {
  isReviewCreate, isReviewUpdate, ReviewCreate, ReviewUpdate,
} from 'book-app-shared/types/Review';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidStars } from 'book-app-shared/helpers/validators';

import { INVALID_ID, INVALID_STARS, INVALID_STRUCTURE } from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


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

  if (!isUndefined(body.stars) && !isValidStars(body.stars)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STARS),
    };
  }

  return {
    checked: normalizeCreateObject(body),
  };
};

export const checkReviewUpdate: CheckFunction<ReviewUpdate> = (body, errPrefix, errPostfix) => {
  if (!isReviewUpdate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  if (!(isUndefined.or(isNull)(body.stars)) && !isValidStars(body.stars)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STARS),
    };
  }

  return {
    checked: normalizeUpdateObject(body),
  };
};
