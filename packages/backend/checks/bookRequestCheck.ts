import {
  BookRequestCreate,
  BookRequestUpdate,
  isBookRequestCreate,
  isBookRequestUpdate,
} from 'book-app-shared/types/BookRequest';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommon: MessageCheckFunction<BookRequestCreate | BookRequestUpdate> = (body) => {
  const { userBookingId } = body;
  if (!isUndefined.or(isNull)(userBookingId) && !isValidId(userBookingId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreate: MessageCheckFunction<BookRequestCreate> = (body) => {
  const {
    userId, userBookingId, createdByBookingUser,
  } = body;
  if (!isValidId(userId)) {
    return CheckResultMessage.invalidId;
  }
  if (createdByBookingUser && isUndefined(userBookingId)) {
    return CheckResultMessage.requestCreatedByBookingNoneGiven;
  }
  if (!createdByBookingUser && !isUndefined(userBookingId)) {
    return CheckResultMessage.requestNotCreatedByBookingButGiven;
  }
  return CheckResultMessage.success;
};

export const checkBookRequestCreate: CheckFunction<BookRequestCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookRequestCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

export const checkBookRequestUpdate: CheckFunction<BookRequestUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isBookRequestUpdate(normalized)) {
    const result = checkMultiple(normalized, checkCommon);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
