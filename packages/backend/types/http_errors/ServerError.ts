import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { HttpError } from './HttpError';
import { ServerErrorMessage } from '../../constants/ErrorMessages';
import { composeMessage } from '../../helpers/stringHelpers/constructMessage';


export class ServerError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.internalServerError;

  constructor(readonly serverErrorMessage?: ServerErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, serverErrorMessage, errPostfix));
  }
}

export const isServerError = (error: HttpError): error is ServerError => error.httpStatusCode === HttpErrorCode.internalServerError;
