import { BookRequestCreate, isBookRequestCreate } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import {
  INVALID_ID,
  INVALID_STRUCTURE,
  REQUEST_CREATED_BY_BOOKING_NONE_GIVEN, REQUEST_NOT_CREATED_BY_BOOKING_BUT_GIVEN,
} from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';


export const checkBookRequestCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<BookRequestCreate> => {
  if (!isBookRequestCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.userId) || !isValidId(body.bookDataId) || (body.userBookingId && !isValidId(body.userBookingId))) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (body.createdByBookingUser && !body.userBookingId) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, REQUEST_CREATED_BY_BOOKING_NONE_GIVEN),
    };
  }

  if (!body.createdByBookingUser && body.userBookingId) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, REQUEST_NOT_CREATED_BY_BOOKING_BUT_GIVEN),
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
