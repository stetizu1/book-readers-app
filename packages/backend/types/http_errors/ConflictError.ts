import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { ConflictErrorMessage } from '../../constants/ErrorMessages';
import { composeMessage } from '../../helpers/stringHelpers/constructMessage';
import { HttpError } from './HttpError';


export class ConflictError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.conflict;

  constructor(readonly conflictErrorMessage?: ConflictErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, conflictErrorMessage, errPostfix));
  }
}

export const isConflictError = (error: HttpError): error is ConflictError => error.httpStatusCode === HttpErrorCode.conflict;
