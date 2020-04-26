import {
  BookRequestCreate,
  BookRequestUpdate,
  isBookRequestCreate,
  isBookRequestUpdate,
} from 'book-app-shared/types/BookRequest';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkUpdate, checkCreate } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommonWithMessage: MessageCheckFunction<BookRequestCreate | BookRequestUpdate> = (body) => {
  const { userBookingId } = body;
  if (!isUndefined.or(isNull)(userBookingId) && !isValidId(userBookingId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreateWithMessage: MessageCheckFunction<BookRequestCreate> = (body) => {
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
  if (!isUndefined(userBookingId) && userBookingId === userId) {
    return CheckResultMessage.requestSameIdGiven;
  }
  return CheckResultMessage.success;
};

const checkUpdateWithMessage: MessageCheckFunction<BookRequestCreate | BookRequestUpdate> = (body) => {
  const { createdByBookingUser } = body;
  if (!isUndefined(createdByBookingUser) && createdByBookingUser) {
    return CheckResultMessage.requestCreateByBookingTryToSetOn;
  }
  return CheckResultMessage.success;
};

export const checkBookRequestCreate: CheckFunction<BookRequestCreate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCommonWithMessage, checkCreateWithMessage);
  return checkCreate(isBookRequestCreate, check, body, errPrefix, errPostfix);
};

export const checkBookRequestUpdate: CheckFunction<BookRequestUpdate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCommonWithMessage, checkUpdateWithMessage);
  return checkUpdate(isBookRequestUpdate, check, body, errPrefix, errPostfix);
};
