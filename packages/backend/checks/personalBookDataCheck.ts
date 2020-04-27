import {
  isPersonalBookDataCreate, isPersonalBookDataUpdate,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { ExportedCheckFunction, CheckFunction } from '../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<PersonalBookDataCreate | PersonalBookDataUpdate> = (body) => {
  const { dateRead } = body;
  if (!isUndefined.or(isNull)(dateRead) && !isValidDate(dateRead)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreate: CheckFunction<PersonalBookDataCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return CheckResultMessage.invalidDate;
  }
  return CheckResultMessage.success;
};

export const checkPersonalBookDataCreate: ExportedCheckFunction<PersonalBookDataCreate> = (body, errPrefix, errPostfix) => (
  executeCheckCreate(body, errPrefix, errPostfix, isPersonalBookDataCreate, checkCommon, checkCreate)
);


export const checkPersonalBookDataUpdate: ExportedCheckFunction<PersonalBookDataUpdate> = (body, errPrefix, errPostfix) => (
  executeCheckUpdate(body, errPrefix, errPostfix, isPersonalBookDataUpdate, checkCommon)
);
