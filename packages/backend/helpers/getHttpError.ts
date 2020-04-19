import {
  composeMessage,
  FORBIDDEN,
  NOT_FOUND,
} from '../constants/errorMessages';
import { ConflictError } from '../types/http_errors/ConflictError';
import { InvalidParametersError } from '../types/http_errors/InvalidParametersError';
import { NotFoundError } from '../types/http_errors/NotFoundError';
import { ForbiddenError } from '../types/http_errors/ForbiddenError';


export const getHttpError = {
  getForbiddenError:
    (errPrefix: string, errPostfix: string): ForbiddenError => new ForbiddenError(composeMessage(errPrefix, FORBIDDEN, errPostfix)),

  getNotFoundError:
    (errPrefix: string, errPostfix: string): NotFoundError => new NotFoundError(composeMessage(errPrefix, NOT_FOUND, errPostfix)),

  getInvalidParametersError:
    (errPrefix: string, errPostfix: string, what: string): InvalidParametersError => new InvalidParametersError(composeMessage(errPrefix, what, errPostfix)),

  getConflictError: (what: string, errPrefix: string, errPostfix?: string): ConflictError => new ConflictError(composeMessage(errPrefix, what, errPostfix)),
};
