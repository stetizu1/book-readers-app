import { Response } from 'express';

import { HttpErrorCode } from '../../constants/HttpErrorCode';
import { PrefixMessage, ServerErrorMessage } from '../../constants/ErrorMessages';
import { HttpError, isHttpError } from '../../types/http_errors/HttpError';


/**
 * Processes error occurred in express request, sets status code to response and send message.
 * @param response - response of express call;
 * @param error - error catched in express request;
 */
export const processError = (response: Response, error: Error | HttpError): void => {
  console.error(`${PrefixMessage.errorProcessed} ${error.message}`);
  console.error(error);
  response.statusCode = isHttpError(error) ? error.httpStatusCode : HttpErrorCode.internalServerError;
  response.send(error.message || ServerErrorMessage.internalServerError);
};
