import { HttpError, isHttpError } from '../../types/http_errors/HttpError';
import { isPostgreSqlError } from '../../types/db/PostgreSqlError';
import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { PostgreSqlErrorCode } from '../../constants/PostgreSqlErrorCode';

import { DatabaseErrorMessage, ForbiddenMessage, ServerErrorMessage } from '../../constants/ErrorMessages';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';
import { composeMessage } from '../stringHelpers/constructMessage';
import { NotFoundError } from '../../types/http_errors/NotFoundError';
import { InvalidParametersError } from '../../types/http_errors/InvalidParametersError';
import { ConflictError } from '../../types/http_errors/ConflictError';
import { ServerError } from '../../types/http_errors/ServerError';

type GetError<T> = (errPrefix: string, errPostfix: string, message?: string) => T;

interface GetHttpError {
  getForbiddenError: GetError<ForbiddenError>;
  getNotFoundError: GetError<NotFoundError>;
  getInvalidParametersError: GetError<InvalidParametersError>;
  getConflictError: GetError<ConflictError>;
  getServerError: GetError<ServerError>;
}

const getHttpError: GetHttpError = {
  getForbiddenError:
    (errPrefix, errPostfix, message) => (
      new ForbiddenError(composeMessage(errPrefix, message, errPostfix))
    ),

  getNotFoundError:
    (errPrefix, errPostfix): NotFoundError => (
      new NotFoundError(composeMessage(errPrefix, DatabaseErrorMessage.notFound, errPostfix))
    ),

  getInvalidParametersError:
    (errPrefix: string, errPostfix, errMessage) => (
      new InvalidParametersError(composeMessage(errPrefix, errMessage, errPostfix))
    ),

  getConflictError:
    (errPrefix, errPostfix, errMessage = ForbiddenMessage.notQualifiedForAction) => (
      new ConflictError(composeMessage(errPrefix, errMessage, errPostfix))
    ),

  getServerError:
    (errPrefix, errPostfix) => (
      new ServerError(composeMessage(errPrefix, ServerErrorMessage.internalServerError, errPostfix))
    ),
};

/**
 * Used to wrap errors occurred in transaction. Returns right error depending on the incoming error.
 * @param error - error occurred in transactions
 * @param errPrefix - prefix for error to be created
 * @param errPostfix - postfix for error to be created
 */
export const processTransactionError = (error: Error, errPrefix: string, errPostfix: string): HttpError => {
  if (isHttpError(error)) {
    const message = error.message || undefined;
    switch (error.httpStatusCode) {
      case HttpErrorCode.invalidParameters:
        return getHttpError.getInvalidParametersError(errPrefix, errPostfix, message);
      case HttpErrorCode.forbidden:
        return getHttpError.getForbiddenError(errPrefix, errPostfix, message);
      case HttpErrorCode.notFound:
        return getHttpError.getNotFoundError(errPrefix, errPostfix);
      case HttpErrorCode.conflict:
        return getHttpError.getConflictError(errPrefix, errPostfix, message);
      default:
        return getHttpError.getServerError(errPrefix, errPostfix);
    }
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
        return getHttpError.getInvalidParametersError(DatabaseErrorMessage.unknownPostgreSqlError, errPrefix, errPostfix);
    }
  }
  return getHttpError.getServerError(DatabaseErrorMessage.unknown, errPrefix, errPostfix);
};
