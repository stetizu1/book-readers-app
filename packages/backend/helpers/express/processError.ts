import { Response } from 'express';

import { HttpError, isHttpError } from '../../httpErrors/HttpError';
import { HttpErrorCodes } from '../../constants/HttpErrorCodes';
import { ERROR_PROCESSING } from '../../constants/errorMessages';

export const processError = (response: Response, error: Error | HttpError): void => {
  console.error(ERROR_PROCESSING + error.message);
  response.statusCode = isHttpError(error) ? error.httpStatusCode : HttpErrorCodes.internalServerError;
  response.send(error.message);
};
