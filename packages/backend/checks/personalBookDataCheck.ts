import {
  isPersonalBookDataCreate, isPersonalBookDataUpdate,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { checkCreate, checkUpdate } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommonWithMessage: MessageCheckFunction<PersonalBookDataCreate | PersonalBookDataUpdate> = (body) => {
  const { dateRead } = body;
  if (!isUndefined.or(isNull)(dateRead) && !isValidDate(dateRead)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreateWithMessage: MessageCheckFunction<PersonalBookDataCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return CheckResultMessage.invalidDate;
  }
  return CheckResultMessage.success;
};

export const checkPersonalBookDataCreate: CheckFunction<PersonalBookDataCreate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCommonWithMessage, checkCreateWithMessage);
  return checkCreate(isPersonalBookDataCreate, check, body, errPrefix, errPostfix);
};


export const checkPersonalBookDataUpdate: CheckFunction<PersonalBookDataUpdate> = (body, errPrefix, errPostfix) => (
  checkUpdate(isPersonalBookDataUpdate, checkCommonWithMessage, body, errPrefix, errPostfix)
);
