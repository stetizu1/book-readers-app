import {
  isPersonalBookDataCreate, isPersonalBookDataUpdate,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { INVALID_DATE, INVALID_ID, INVALID_STRUCTURE } from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


export const checkPersonalBookDataCreate: CheckFunction<PersonalBookDataCreate> = (body, errPrefix, errPostfix) => {
  if (!isPersonalBookDataCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.bookDataId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (body.dateRead && !isValidDate(body.dateRead)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_DATE),
    };
  }

  // switch possibly empty to undefined
  return {
    checked: normalizeCreateObject(body),
  };
};

export const checkPersonalBookDataUpdate: CheckFunction<PersonalBookDataUpdate> = (body, errPrefix, errPostfix) => {
  if (!isPersonalBookDataUpdate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  if (body.dateRead && !isValidDate(body.dateRead)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_DATE),
    };
  }

  return {
    checked: normalizeUpdateObject(body),
  };
};
