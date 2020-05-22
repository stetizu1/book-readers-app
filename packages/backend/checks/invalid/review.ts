import {
  isReviewCreate, isReviewUpdate, ReviewCreate, ReviewUpdate,
} from 'book-app-shared/types/Review';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidStarsCount } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<ReviewCreate | ReviewUpdate> = (body) => {
  const { stars } = body;
  if (!isUndefined.or(isNull)(stars) && !isValidStarsCount(stars)) {
    return InvalidParametersErrorMessage.invalidStars;
  }
  return Success.checkSuccess;
};

const checkCreate: CheckFunction<ReviewCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return InvalidParametersErrorMessage.invalidId;
  }
  return Success.checkSuccess;
};

export const checkReviewCreate: ExportedCheckFunction<ReviewCreate> = (body) => (
  executeCheckCreate(body, isReviewCreate, checkCommon, checkCreate)
);


export const checkReviewUpdate: ExportedCheckFunction<ReviewUpdate> = (body) => (
  executeCheckUpdate(body, isReviewUpdate, checkCommon)
);
