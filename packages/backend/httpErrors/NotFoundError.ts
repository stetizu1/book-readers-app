import { HttpError } from './HttpError';
import { HttpErrorCodes } from '../constants/HttpErrorCodes';

export class NotFoundError extends HttpError {
  readonly httpStatusCode = HttpErrorCodes.notFound;
}
