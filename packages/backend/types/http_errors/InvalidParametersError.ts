import { HttpErrorCodes } from '../../constants/HttpErrorCodes';
import { HttpError } from './HttpError';


export class InvalidParametersError extends HttpError {
  readonly httpStatusCode = HttpErrorCodes.invalidParameters;
}
