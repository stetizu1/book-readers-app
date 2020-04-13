import { HttpErrorCodes } from '../../constants/HttpErrorCodes';
import { HttpError } from './HttpError';


export class ConflictError extends HttpError {
  readonly httpStatusCode = HttpErrorCodes.conflict;
}
