import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';

export abstract class HttpError extends Error {
  readonly abstract httpStatusCode: HttpErrorCode;
}

export const isHttpError = (error: Error): error is HttpError => 'httpStatusCode' in error;
