import {
  isReviewCreate, isReviewUpdate, ReviewCreate, ReviewUpdate,
} from 'book-app-shared/types/Review';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidStarsCount } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<ReviewCreate | ReviewUpdate> = (body) => {
  const { stars } = body;
  if (!isUndefined.or(isNull)(stars) && !isValidStarsCount(stars)) {
    return CheckResultMessage.invalidStars;
  }
  return CheckResultMessage.success;
};

const checkCreate: CheckFunction<ReviewCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkReviewCreate: ExportedCheckFunction<ReviewCreate> = (body, errPrefix, errPostfix) => (
  executeCheckCreate(body, errPrefix, errPostfix, isReviewCreate, checkCommon, checkCreate)
);


export const checkReviewUpdate: ExportedCheckFunction<ReviewUpdate> = (body, errPrefix, errPostfix) => (
  executeCheckUpdate(body, errPrefix, errPostfix, isReviewUpdate, checkCommon)
);
