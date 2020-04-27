import {
  BookRequestCreate,
  BookRequestUpdate,
  isBookRequestCreate,
  isBookRequestUpdate,
} from 'book-app-shared/types/BookRequest';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../types/CheckResult';
import { executeCheckUpdate, executeCheckCreate } from '../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<BookRequestCreate | BookRequestUpdate> = (body) => {
  const { userBookingId } = body;
  if (!isUndefined.or(isNull)(userBookingId) && !isValidId(userBookingId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreate: CheckFunction<BookRequestCreate> = (body) => {
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

const checkUpdate: CheckFunction<BookRequestCreate | BookRequestUpdate> = (body) => {
  const { createdByBookingUser } = body;
  if (!isUndefined(createdByBookingUser) && createdByBookingUser) {
    return CheckResultMessage.requestCreateByBookingTryToSetOn;
  }
  return CheckResultMessage.success;
};

export const checkBookRequestCreate: ExportedCheckFunction<BookRequestCreate> = (body) => (
  executeCheckCreate(body, isBookRequestCreate, checkCommon, checkCreate)
);

export const checkBookRequestUpdate: ExportedCheckFunction<BookRequestUpdate> = (body) => (
  executeCheckUpdate(body, isBookRequestUpdate, checkCommon, checkUpdate)
);
