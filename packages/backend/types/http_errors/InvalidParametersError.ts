import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { InvalidParametersErrorMessage } from '../../constants/ErrorMessages';
import { composeMessage } from '../../helpers/stringHelpers/constructMessage';
import { HttpError } from './HttpError';


export class InvalidParametersError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.invalidParameters;

  constructor(readonly invalidParametersErrorMessage?: InvalidParametersErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, invalidParametersErrorMessage, errPostfix));
  }
}

export const isInvalidParametersError = (error: HttpError): error is InvalidParametersError => error.httpStatusCode === HttpErrorCode.invalidParameters;
