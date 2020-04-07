export abstract class HttpError extends Error {
  readonly abstract httpStatusCode: number;
}

export const isHttpError = (error: Error): error is HttpError => Object.hasOwnProperty.call(error, 'httpStatusCode');
