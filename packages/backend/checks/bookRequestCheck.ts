import { BookRequestCreate, isBookRequestCreate } from 'book-app-shared/types/BookRequest';
import { isValidId } from 'book-app-shared/helpers/validators';

import {
  INVALID_ID,
  INVALID_STRUCTURE,
  REQUEST_CREATED_BY_BOOKING_NONE_GIVEN, REQUEST_NOT_CREATED_BY_BOOKING_BUT_GIVEN,
} from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


export const checkBookRequestCreate: CheckFunction<BookRequestCreate> = (body, errPrefix, errPostfix) => {
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

  return {
    checked: normalizeCreateObject(body),
  };
};
