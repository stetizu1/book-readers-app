import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';
import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { InvalidParametersErrorMessage } from '../../constants/ErrorMessages';
import { HttpError } from './HttpError';


export class InvalidParametersError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.invalidParameters;

  constructor(readonly invalidParametersErrorMessage?: InvalidParametersErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, invalidParametersErrorMessage, errPostfix));
  }
}

export const isInvalidParametersError = (error: HttpError): error is InvalidParametersError => error.httpStatusCode === HttpErrorCode.invalidParameters;
