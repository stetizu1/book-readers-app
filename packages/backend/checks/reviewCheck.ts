import {
  isReviewCreate, isReviewUpdate, ReviewCreate, ReviewUpdate,
} from 'book-app-shared/types/Review';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidStarsCount } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkCreate, checkUpdate } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommonWithMessage: MessageCheckFunction<ReviewCreate | ReviewUpdate> = (body) => {
  const { stars } = body;
  if (!isUndefined.or(isNull)(stars) && !isValidStarsCount(stars)) {
    return CheckResultMessage.invalidStars;
  }
  return CheckResultMessage.success;
};

const checkCreateWithMessage: MessageCheckFunction<ReviewCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkReviewCreate: CheckFunction<ReviewCreate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCommonWithMessage, checkCreateWithMessage);
  return checkCreate(isReviewCreate, check, body, errPrefix, errPostfix);
};


export const checkReviewUpdate: CheckFunction<ReviewUpdate> = (body, errPrefix, errPostfix) => (
  checkUpdate(isReviewUpdate, checkCommonWithMessage, body, errPrefix, errPostfix)
);
