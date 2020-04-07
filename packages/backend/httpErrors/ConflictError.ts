import { HttpError } from './HttpError';
import { HttpErrorCodes } from '../constants/HttpErrorCodes';

export class ConflictError extends HttpError {
  readonly httpStatusCode = HttpErrorCodes.conflict;
}
