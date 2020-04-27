import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { NotFoundErrorMessage } from '../../constants/ErrorMessages';
import { composeMessage } from '../../helpers/stringHelpers/constructMessage';
import { HttpError } from './HttpError';


export class NotFoundError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.notFound;

  constructor(readonly notFoundErrorMessage?: NotFoundErrorMessage, errPrefix?: string, errPostfix?: string) {
    super(composeMessage(errPrefix, notFoundErrorMessage, errPostfix));
  }
}

export const isNotFoundError = (error: HttpError): error is NotFoundError => error.httpStatusCode === HttpErrorCode.notFound;
