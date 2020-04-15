import { HttpError, isHttpError } from '../types/http_errors/HttpError';
import { HttpErrorCode } from '../constants/HttpErrorCode';
import {
  isErrorWithCode, isForeignKeyViolation, isNotNullViolation, isUniqueViolation,
} from '../db/errorChecks';
import {
  FOREIGN_KEY_VIOLATION, NULL_VIOLATION, UNIQUE_VIOLATION, UNKNOWN,
} from '../constants/errorMessages';
import { getHttpError } from './getHttpError';

export const processTransactionError = (error: Error, errPrefix: string, errPostfix?: string): HttpError => {
  if (isHttpError(error) && error.httpStatusCode === HttpErrorCode.notFound) {
    return getHttpError.getNotFoundError(errPrefix, errPostfix);
  }

  if (isErrorWithCode(error)) {
    if (isForeignKeyViolation(error)) {
      return getHttpError.getConflictError(FOREIGN_KEY_VIOLATION, errPrefix, errPostfix);
    }

    if (isUniqueViolation(error)) {
      return getHttpError.getConflictError(UNIQUE_VIOLATION, errPrefix, errPostfix);
    }

    if (isNotNullViolation(error)) {
      return getHttpError.getConflictError(NULL_VIOLATION, errPrefix, errPostfix);
    }
  }
  return getHttpError.getInvalidParametersError(errPrefix, errPostfix, UNKNOWN);
};
