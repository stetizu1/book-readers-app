import { HttpError } from './HttpError';
import { HttpErrorCode } from '../../constants/HttpErrorCode';

export class NotFoundError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.notFound;
}
