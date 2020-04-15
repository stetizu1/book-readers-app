import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { HttpError } from './HttpError';


export class ConflictError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.conflict;
}
