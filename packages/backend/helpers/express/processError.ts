import { Response } from 'express';

import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { ERROR_PROCESSING } from '../../constants/errorMessages';
import { HttpError, isHttpError } from '../../types/http_errors/HttpError';


export const processError = (response: Response, error: Error | HttpError): void => {
  console.error(`${ERROR_PROCESSING} ${error.message}`);
  console.error(error);
  response.statusCode = isHttpError(error) ? error.httpStatusCode : HttpErrorCode.internalServerError;
  response.send(error.message);
};
