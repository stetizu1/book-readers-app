import { HttpError } from './HttpError';
import { HttpErrorCodes } from '../constants/HttpErrorCodes';

export class ForbiddenError extends HttpError {
  readonly httpStatusCode = HttpErrorCodes.forbidden;
}
