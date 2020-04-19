import { HttpError, isHttpError } from '../types/http_errors/HttpError';
import { isPostgreSqlError } from '../types/db/PostgreSqlError';
import { HttpErrorCode } from '../constants/HttpErrorCode';
import { PostgreSqlErrorCode } from '../constants/PostgreSqlErrorCode';

import {
  FOREIGN_KEY_VIOLATION, NULL_VIOLATION, UNIQUE_VIOLATION, UNKNOWN, UNKNOWN_POSTGRESQL_ERROR,
} from '../constants/errorMessages';
import { getHttpError } from './getHttpError';


export const processTransactionError = (error: Error, errPrefix: string, errPostfix?: string): HttpError => {
  if (isHttpError(error) && error.httpStatusCode === HttpErrorCode.notFound) {
    return getHttpError.getNotFoundError(errPrefix, errPostfix);
  }

  if (isPostgreSqlError(error)) {
    switch (error.code) {
      case PostgreSqlErrorCode.ForeignKeyViolation:
        return getHttpError.getConflictError(FOREIGN_KEY_VIOLATION, errPrefix, errPostfix);
      case PostgreSqlErrorCode.UniqueViolation:
        return getHttpError.getConflictError(UNIQUE_VIOLATION, errPrefix, errPostfix);
      case PostgreSqlErrorCode.NotNullViolation:
        return getHttpError.getConflictError(NULL_VIOLATION, errPrefix, errPostfix);
      default:
        console.error(error.code);
        return getHttpError.getInvalidParametersError(errPrefix, errPostfix, UNKNOWN_POSTGRESQL_ERROR);
    }
  }
  return getHttpError.getInvalidParametersError(errPrefix, errPostfix, UNKNOWN);
};
