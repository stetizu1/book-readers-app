import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { HttpError } from './HttpError';


export class ServerError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.internalServerError;
}
