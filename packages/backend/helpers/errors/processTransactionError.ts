import { HttpError, isHttpError } from '../../types/http_errors/HttpError';
import { isPostgreSqlError } from '../../types/db/PostgreSqlError';
import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { PostgreSqlErrorCode } from '../../constants/PostgreSqlErrorCode';

import { DatabaseErrorMessage } from '../../constants/ErrorMessages';
import { getHttpError } from './getHttpError';


/**
 * Used to wrap errors occurred in transaction. Returns right error depending on the incoming error.
 * @param error - error occurred in transactions
 * @param errPrefix - prefix for error to be created
 * @param errPostfix - postfix for error to be created
 */
export const processTransactionError = (error: Error, errPrefix: string, errPostfix: string): HttpError => {
  if (isHttpError(error) && error.httpStatusCode === HttpErrorCode.notFound) {
    return getHttpError.getNotFoundError(errPrefix, errPostfix);
  }

  if (isPostgreSqlError(error)) {
    switch (error.code) {
      case PostgreSqlErrorCode.ForeignKeyViolation:
        return getHttpError.getConflictError(DatabaseErrorMessage.foreignKeyViolation, errPrefix, errPostfix);
      case PostgreSqlErrorCode.UniqueViolation:
        return getHttpError.getConflictError(DatabaseErrorMessage.uniqueViolation, errPrefix, errPostfix);
      case PostgreSqlErrorCode.NotNullViolation:
        return getHttpError.getConflictError(DatabaseErrorMessage.nullViolation, errPrefix, errPostfix);
      default:
        console.error(error.code);
        return getHttpError.getInvalidParametersError(errPrefix, errPostfix, DatabaseErrorMessage.unknownPostgreSqlError);
    }
  }
  return getHttpError.getInvalidParametersError(errPrefix, errPostfix, DatabaseErrorMessage.unknown);
};
