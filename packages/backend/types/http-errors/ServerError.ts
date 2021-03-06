import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';
import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { HttpError } from './HttpError';
import { ServerErrorMessage } from '../../constants/ErrorMessages';


export class ServerError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.internalServerError;

  constructor(readonly serverErrorMessage?: ServerErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, serverErrorMessage, errPostfix));
  }
}

export const isServerError = (error: HttpError): error is ServerError => error.httpStatusCode === HttpErrorCode.internalServerError;
