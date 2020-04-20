import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { HttpError } from './HttpError';


export class NotFoundError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.notFound;
}
