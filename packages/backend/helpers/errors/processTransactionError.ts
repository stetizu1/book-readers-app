import { HttpError, isHttpError } from '../../types/http_errors/HttpError';
import { isPostgreSqlError } from '../../types/db/PostgreSqlError';
import { PostgreSqlErrorCode } from '../../constants/PostgreSqlErrorCode';

import {
  ConflictErrorMessage,
  ForbiddenErrorMessage,
  InvalidParametersErrorMessage,
  NotFoundErrorMessage,
  ServerErrorMessage,
} from '../../constants/ErrorMessages';
import { ForbiddenError, isForbiddenError } from '../../types/http_errors/ForbiddenError';
import { isNotFoundError, NotFoundError } from '../../types/http_errors/NotFoundError';
import { InvalidParametersError, isInvalidParametersError } from '../../types/http_errors/InvalidParametersError';
import { ConflictError, isConflictError } from '../../types/http_errors/ConflictError';
import { ServerError } from '../../types/http_errors/ServerError';

type GetError<TError, TMessage> = (errPrefix: string, errPostfix: string, message?: TMessage) => TError;

interface GetHttpError {
  getForbiddenError: GetError<ForbiddenError, ForbiddenErrorMessage>;
  getNotFoundError: GetError<NotFoundError, NotFoundErrorMessage>;
  getInvalidParametersError: GetError<InvalidParametersError, InvalidParametersErrorMessage>;
  getConflictError: GetError<ConflictError, ConflictErrorMessage>;
  getServerError: GetError<ServerError, ServerErrorMessage>;
}

const getHttpError: GetHttpError = {
  getForbiddenError:
    (errPrefix, errPostfix, errMessage = ForbiddenErrorMessage.notQualifiedForAction) => (
      new ForbiddenError(errMessage, errPrefix, errPostfix)
    ),

  getNotFoundError:
    (errPrefix, errPostfix): NotFoundError => (
      new NotFoundError(NotFoundErrorMessage.notFound, errPrefix, errPostfix)
    ),

  getInvalidParametersError:
    (errPrefix: string, errPostfix, errMessage) => (
      new InvalidParametersError(errMessage, errPrefix, errPostfix)
    ),

  getConflictError:
    (errPrefix, errPostfix, errMessage) => (
      new ConflictError(errMessage, errPrefix, errPostfix)
    ),

  getServerError:
    (errPrefix, errPostfix) => (
      new ServerError(ServerErrorMessage.internalServerError, errPrefix, errPostfix)
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
    if (isInvalidParametersError(error)) return getHttpError.getInvalidParametersError(errPrefix, errPostfix, error.invalidParametersErrorMessage);
    if (isForbiddenError(error)) return getHttpError.getForbiddenError(errPrefix, errPostfix, error.forbiddenErrorMessage);
    if (isNotFoundError(error)) return getHttpError.getNotFoundError(errPrefix, errPostfix);
    if (isConflictError(error)) return getHttpError.getConflictError(errPrefix, errPostfix, error.conflictErrorMessage);
    return getHttpError.getServerError(errPrefix, errPostfix);
  }

  if (isPostgreSqlError(error)) {
    switch (error.code) {
      case PostgreSqlErrorCode.ForeignKeyViolation:
        return getHttpError.getConflictError(errPrefix, errPostfix, ConflictErrorMessage.foreignKeyViolation);
      case PostgreSqlErrorCode.UniqueViolation:
        return getHttpError.getConflictError(errPrefix, errPostfix, ConflictErrorMessage.uniqueViolation);
      case PostgreSqlErrorCode.NotNullViolation:
        return getHttpError.getConflictError(errPrefix, errPostfix, ConflictErrorMessage.nullViolation);
      default:
        console.error(error.code);
        return getHttpError.getConflictError(errPrefix, errPostfix, ConflictErrorMessage.unknownPostgreSqlError);
    }
  }
  return getHttpError.getServerError(errPrefix, errPostfix, ServerErrorMessage.unknown);
};
