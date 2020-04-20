import {
  isPersonalBookDataCreate, isPersonalBookDataUpdate,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommon: MessageCheckFunction<PersonalBookDataCreate | PersonalBookDataUpdate> = (body) => {
  const { dateRead } = body;
  if (!isUndefined.or(isNull)(dateRead) && !isValidDate(dateRead)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreate: MessageCheckFunction<PersonalBookDataCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return CheckResultMessage.invalidDate;
  }
  return CheckResultMessage.success;
};

export const checkPersonalBookDataCreate: CheckFunction<PersonalBookDataCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isPersonalBookDataCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};


export const checkPersonalBookDataUpdate: CheckFunction<PersonalBookDataUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isPersonalBookDataUpdate(normalized)) {
    const result = checkCommon(normalized);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
