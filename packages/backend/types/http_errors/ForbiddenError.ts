import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { HttpError } from './HttpError';


export class ForbiddenError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.forbidden;
}
