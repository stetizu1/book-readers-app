import { isPersonalBookDataCreate, PersonalBookDataCreate } from 'book-app-shared/types/PersonalBookData';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { INVALID_DATE, INVALID_ID, INVALID_STRUCTURE } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';


export const isPersonalBookDataNotEmpty = (personalBookData: PersonalBookDataCreate): boolean => !!personalBookData.dateRead || !!personalBookData.comment;

export const checkPersonalBookDataCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<PersonalBookDataCreate> => {
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
    checked: {
      ...body,
      dateRead: body.dateRead || undefined,
      comment: body.comment || undefined,
    },
  };
};
