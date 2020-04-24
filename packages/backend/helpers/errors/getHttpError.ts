import { DatabaseErrorMessage } from '../../constants/ErrorMessages';
import { ConflictError } from '../../types/http_errors/ConflictError';
import { InvalidParametersError } from '../../types/http_errors/InvalidParametersError';
import { NotFoundError } from '../../types/http_errors/NotFoundError';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';
import { composeMessage } from '../stringHelpers/constructMessage';


/**
 * Constructs new requested error with given parameters in message.
 */
export const getHttpError = {
  getForbiddenError:
    (errMessage: string, errPrefix: string, errPostfix: string): ForbiddenError => new ForbiddenError(composeMessage(errPrefix, errMessage, errPostfix)),

  getNotFoundError:
    (errPrefix: string, errPostfix: string): NotFoundError => new NotFoundError(composeMessage(errPrefix, DatabaseErrorMessage.notFound, errPostfix)),

  getInvalidParametersError:
    (errMessage: string, errPrefix: string, errPostfix: string): InvalidParametersError => new InvalidParametersError(composeMessage(errPrefix, errMessage, errPostfix)),

  getConflictError:
    (errMessage: string, errPrefix: string, errPostfix?: string): ConflictError => new ConflictError(composeMessage(errPrefix, errMessage, errPostfix)),
};
