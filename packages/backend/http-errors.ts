export class InputParametersError extends Error {
  readonly httpStatusCode = 400;
}

export class ForbiddenError extends Error {
  readonly httpStatusCode = 403;
}

export class NotFoundError extends Error {
  readonly httpStatusCode = 404;
}

export class ConflictError extends Error {
  readonly httpStatusCode = 409;
}

export type HttpErrors = InputParametersError | ForbiddenError | NotFoundError | ConflictError;
