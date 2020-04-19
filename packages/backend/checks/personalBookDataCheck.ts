import {
  isPersonalBookDataCreate, isPersonalBookDataUpdate,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/constructCheckResult';
import { checkMultiple } from '../helpers/checkMultiple';


const checkCommon: MessageCheckFunction<PersonalBookDataCreate | PersonalBookDataUpdate> = (body) => {
  const { dateRead } = body;
  if (!isUndefined.or(isNull)(dateRead) && !isValidDate(dateRead)) {
    return CheckResultValue.invalidId;
  }
  return CheckResultValue.success;
};

const checkCreate: MessageCheckFunction<PersonalBookDataCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return CheckResultValue.invalidDate;
  }
  return CheckResultValue.success;
};

export const checkPersonalBookDataCreate: CheckFunction<PersonalBookDataCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isPersonalBookDataCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};


export const checkPersonalBookDataUpdate: CheckFunction<PersonalBookDataUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isPersonalBookDataUpdate(normalized)) {
    const result = checkCommon(normalized);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
