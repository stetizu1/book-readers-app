import { HttpErrorCodes } from '../../constants/HttpErrorCodes';
import { HttpError } from './HttpError';


export class ForbiddenError extends HttpError {
  readonly httpStatusCode = HttpErrorCodes.forbidden;
}
