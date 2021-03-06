import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';
import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { NotFoundErrorMessage } from '../../constants/ErrorMessages';
import { HttpError } from './HttpError';


export class NotFoundError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.notFound;

  constructor(readonly notFoundErrorMessage?: NotFoundErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, notFoundErrorMessage, errPostfix));
  }
}

export const isNotFoundError = (error: HttpError): error is NotFoundError => error.httpStatusCode === HttpErrorCode.notFound;
