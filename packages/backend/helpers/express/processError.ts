import { Response } from 'express';

import { HttpErrorCodes } from '../../constants/HttpErrorCodes';
import { ERROR_PROCESSING } from '../../constants/errorMessages';
import { HttpError, isHttpError } from '../../types/http_errors/HttpError';


export const processError = (response: Response, error: Error | HttpError): void => {
  console.error(`${ERROR_PROCESSING} ${error.message}`);
  console.error(error);
  response.statusCode = isHttpError(error) ? error.httpStatusCode : HttpErrorCodes.internalServerError;
  response.send(error.message);
};
