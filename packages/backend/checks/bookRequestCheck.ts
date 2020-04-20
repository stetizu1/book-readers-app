import { BookRequestCreate, isBookRequestCreate } from 'book-app-shared/types/BookRequest';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/checks/constructCheckResult';


const checkCreate: MessageCheckFunction<BookRequestCreate> = (body) => {
  const {
    userId, bookDataId, userBookingId, createdByBookingUser,
  } = body;
  if (!isValidId(userId)
    || !isValidId(bookDataId)
    || (!isUndefined(userBookingId) && !isValidId(userBookingId))) {
    return CheckResultMessage.invalidId;
  }
  if (createdByBookingUser && !userBookingId) {
    return CheckResultMessage.requestCreatedByBookingNoneGiven;
  }
  if (!createdByBookingUser && userBookingId) {
    return CheckResultMessage.requestNotCreatedByBookingButGiven;
  }
  return CheckResultMessage.success;
};

export const checkBookRequestCreate: CheckFunction<BookRequestCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookRequestCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
