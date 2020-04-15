import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { HttpError } from './HttpError';


export class InvalidParametersError extends HttpError {
  readonly httpStatusCode = HttpErrorCode.invalidParameters;
}
