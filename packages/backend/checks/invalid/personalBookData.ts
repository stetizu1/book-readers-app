import {
  isPersonalBookDataCreate, isPersonalBookDataUpdate,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { ExportedCheckFunction, CheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<PersonalBookDataCreate | PersonalBookDataUpdate> = (body) => {
  const { dateRead } = body;
  if (!isUndefined.or(isNull)(dateRead) && !isValidDate(dateRead)) {
    return InvalidParametersErrorMessage.invalidId;
  }
  return Success.checkSuccess;
};

const checkCreate: CheckFunction<PersonalBookDataCreate> = (body) => {
  const { bookDataId } = body;
  if (!isValidId(bookDataId)) {
    return InvalidParametersErrorMessage.invalidDate;
  }
  return Success.checkSuccess;
};

export const checkPersonalBookDataCreate: ExportedCheckFunction<PersonalBookDataCreate> = (body) => (
  executeCheckCreate(body, isPersonalBookDataCreate, checkCommon, checkCreate)
);


export const checkPersonalBookDataUpdate: ExportedCheckFunction<PersonalBookDataUpdate> = (body) => (
  executeCheckUpdate(body, isPersonalBookDataUpdate, checkCommon)
);
