import { isReviewCreate, ReviewCreate } from 'book-app-shared/types/Review';
import { isValidId, isValidStars } from 'book-app-shared/helpers/validators';

import { INVALID_ID, INVALID_STARS, INVALID_STRUCTURE } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';


export const isReviewNotEmpty = (reviewCreate: ReviewCreate): boolean => reviewCreate.stars === undefined || !!reviewCreate.comment;

export const checkReviewCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<ReviewCreate> => {
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
    checked: {
      ...body,
      comment: body.comment || undefined,
    },
  };
};
