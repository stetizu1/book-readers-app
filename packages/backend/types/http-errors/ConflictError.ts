import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';
import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { ConflictErrorMessage } from '../../constants/ErrorMessages';
import { HttpError } from './HttpError';


export class ConflictError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.conflict;

  constructor(readonly conflictErrorMessage?: ConflictErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, conflictErrorMessage, errPostfix));
  }
}

export const isConflictError = (error: HttpError): error is ConflictError => error.httpStatusCode === HttpErrorCode.conflict;
