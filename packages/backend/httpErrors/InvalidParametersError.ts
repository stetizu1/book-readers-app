import { HttpError } from './HttpError';
import { HttpErrorCodes } from '../constants/HttpErrorCodes';

export class InvalidParametersError extends HttpError {
  readonly httpStatusCode = HttpErrorCodes.invalidParameters;
}
