import { Response } from 'express';

import { HttpErrorCodes } from '../../constants/HttpErrorCodes';
import { ERROR_PROCESSING } from '../../constants/errorMessages';
import { HttpError, isHttpError } from '../../httpErrors/HttpError';


export const processError = (response: Response, error: Error | HttpError): void => {
  console.error(ERROR_PROCESSING + error.message);
  response.statusCode = isHttpError(error) ? error.httpStatusCode : HttpErrorCodes.internalServerError;
  response.send(error.message);
};
