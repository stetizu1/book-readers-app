import { BookDataCreate, isBookDataCreate } from 'book-app-shared/types/BookData';
import { isValidId, isValidIsbn, isValidYear } from 'book-app-shared/helpers/validators';

import {
  INVALID_ID, INVALID_ISBN, INVALID_STRUCTURE, INVALID_YEAR,
} from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';
import { checkReviewCreate, isReviewNotEmpty } from './reviewCheck';
import { checkPersonalBookDataCreate, isPersonalBookDataNotEmpty } from './personalBookDataCheck';

export const checkBookDataCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<BookDataCreate> => {
  if (!isBookDataCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  const {
    bookId, userId, publisher, yearPublished, isbn, image, genreId, labelsIds, review, personalBookData,
  } = body;

  if (!isValidId(bookId)
    || (genreId && !isValidId(genreId))
    || (labelsIds && (labelsIds.find((id) => !isValidId(id))) !== undefined)
  ) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (userId && !isValidId(userId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (yearPublished && !isValidYear(yearPublished)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_YEAR),
    };
  }

  if (isbn && !isValidIsbn(isbn)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ISBN),
    };
  }

  const reviewCreate = review && isReviewNotEmpty(review) ? review : undefined;
  const personalBookDataCreate = personalBookData && isPersonalBookDataNotEmpty(personalBookData) ? personalBookData : undefined;

  if (reviewCreate) {
    const reviewCreateCheckResult = checkReviewCreate(reviewCreate, errPrefix, errPostfix);
    if (!reviewCreateCheckResult.checked) {
      return {
        checked: false,
        checkError: reviewCreateCheckResult.checkError,
      };
    }
  }

  if (personalBookDataCreate) {
    const personalBookDataCreateCheckResult = checkPersonalBookDataCreate(reviewCreate, errPrefix, errPostfix);
    if (!personalBookDataCreateCheckResult.checked) {
      return {
        checked: false,
        checkError: personalBookDataCreateCheckResult.checkError,
      };
    }
  }

  // switch possibly empty to undefined
  return {
    checked: {
      ...body,
      publisher: publisher || undefined,
      yearPublished: yearPublished || undefined,
      isbn: isbn || undefined,
      image: image || undefined,
      review: reviewCreate,
      personalBookData: personalBookDataCreate,
    },
  };
};
