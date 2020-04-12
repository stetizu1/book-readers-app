import {
  composeMessage,
  INVALID_STRUCTURE, NOT_FOUND, FORBIDDEN,
  UNIQUE_VIOLATION, FOREIGN_KEY_VIOLATION, UNKNOWN,
} from '../constants/errorMessages';
import { isErrorWithCode, isForeignKeyViolation, isUniqueViolation } from '../db/errors';
import { ConflictError } from '../httpErrors/ConflictError';
import { InvalidParametersError } from '../httpErrors/InvalidParametersError';
import { NotFoundError } from '../httpErrors/NotFoundError';
import { ForbiddenError } from '../httpErrors/ForbiddenError';


export const getHttpError = {
  getForbiddenError:
    (errPrefix: string, errPostfix?: string): ForbiddenError => new ForbiddenError(composeMessage(errPrefix, FORBIDDEN, errPostfix)),

  getNotFoundError:
    (errPrefix: string, errPostfix?: string): NotFoundError => new NotFoundError(composeMessage(errPrefix, NOT_FOUND, errPostfix)),

  getInvalidParametersError:
    (errPrefix: string, errPostfix?: string, what = INVALID_STRUCTURE): InvalidParametersError => new InvalidParametersError(composeMessage(errPrefix, what, errPostfix)),

  getConflictError: (what: string, errPrefix: string, errPostfix?: string): ConflictError => new ConflictError(composeMessage(errPrefix, what, errPostfix)),
};

export const processTransactionError = (error: Error, errPrefix: string, errPostfix?: string): InvalidParametersError | ConflictError => {
  if (isErrorWithCode(error)) {
    if (isForeignKeyViolation(error)) {
      return getHttpError.getConflictError(FOREIGN_KEY_VIOLATION, errPrefix, errPostfix);
    }

    if (isUniqueViolation(error)) {
      return getHttpError.getConflictError(UNIQUE_VIOLATION, errPrefix, errPostfix);
    }
  }
  return getHttpError.getInvalidParametersError(errPrefix, errPostfix, UNKNOWN);
};
