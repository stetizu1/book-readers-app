import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';
import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { ForbiddenErrorMessage } from '../../constants/ErrorMessages';
import { HttpError } from './HttpError';


export class ForbiddenError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.forbidden;

  constructor(readonly forbiddenErrorMessage?: ForbiddenErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, forbiddenErrorMessage, errPostfix));
  }
}

export const isForbiddenError = (error: HttpError): error is ForbiddenError => error.httpStatusCode === HttpErrorCode.forbidden;
