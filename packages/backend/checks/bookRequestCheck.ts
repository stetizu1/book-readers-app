import { BookRequestCreate, isBookRequestCreate } from 'book-app-shared/types/BookRequest';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/constructCheckResult';


const checkCreate: MessageCheckFunction<BookRequestCreate> = (body) => {
  const {
    userId, bookDataId, userBookingId, createdByBookingUser,
  } = body;
  if (!isValidId(userId)
    || !isValidId(bookDataId)
    || (!isUndefined(userBookingId) && !isValidId(userBookingId))) {
    return CheckResultValue.invalidId;
  }
  if (createdByBookingUser && !userBookingId) {
    return CheckResultValue.requestCreatedByBookingNoneGiven;
  }
  if (!createdByBookingUser && userBookingId) {
    return CheckResultValue.requestNotCreatedByBookingButGiven;
  }
  return CheckResultValue.success;
};

export const checkBookRequestCreate: CheckFunction<BookRequestCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookRequestCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
