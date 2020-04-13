import { BookDataCreate, isBookDataCreate } from 'book-app-shared/types/BookData';
import {
  isNotEmptyObject, isValidId, isValidIsbn, isValidYear,
} from 'book-app-shared/helpers/validators';

import {
  INVALID_ID, INVALID_ISBN, INVALID_STRUCTURE, INVALID_YEAR,
} from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';


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

  // validity checked later in their own repository
  const reviewCreate = review && isNotEmptyObject(review) ? review : undefined;
  const personalBookDataCreate = personalBookData && isNotEmptyObject(personalBookData) ? personalBookData : undefined;

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
