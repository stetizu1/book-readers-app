import {
  isReviewCreate, isReviewUpdate, ReviewCreate, ReviewUpdate,
} from 'book-app-shared/types/Review';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidStars } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/constructCheckResult';
import { checkMultiple } from '../helpers/checkMultiple';


const checkCommon: MessageCheckFunction<ReviewCreate | ReviewUpdate> = (body) => {
  const { stars } = body;
  if (!isUndefined.or(isNull)(stars) && !isValidStars(stars)) {
    return CheckResultValue.invalidStars;
  }
  return CheckResultValue.success;
};

const checkCreate: MessageCheckFunction<ReviewCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return CheckResultValue.invalidId;
  }
  return CheckResultValue.success;
};

export const checkReviewCreate: CheckFunction<ReviewCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isReviewCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};


export const checkReviewUpdate: CheckFunction<ReviewUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isReviewUpdate(normalized)) {
    const result = checkCommon(normalized);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
