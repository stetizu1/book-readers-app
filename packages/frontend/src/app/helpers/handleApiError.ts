import { put } from '@redux-saga/core/effects';
import { PayloadActionCreator } from 'typesafe-actions';

import { UnknownType } from 'book-app-shared/types/others/UnknownType';
import {
  isNumber,
  isString,
  isStructure,
  typeCheckFactory,
  TypeCheckFunction,
} from 'book-app-shared/helpers/typeChecks';

import { composeMessage } from 'book-app-shared/helpers/composeMessage';
import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';
import { ApiErrorMessage, ApiErrorPrefix } from '../messages/ErrorMessage';


interface Response {
  data: string;
  status: number;
}

interface ErrorWithResponse extends Error {
  response: Response;
}

export const isErrorWithResponse: TypeCheckFunction<ErrorWithResponse> = typeCheckFactory(
  (test): test is ErrorWithResponse => (
    isStructure<UnknownType<ErrorWithResponse>>(test, ['response'])
    && isStructure<UnknownType<Response>>(test.response, ['data', 'status'])
    && isString(test.response.data)
    && isNumber(test.response.status)
  ),
);

const getCorrespondingErrorMessage = (error: unknown): ApiErrorMessage => {
  if (isErrorWithResponse(error)) {
    console.error(error.response);
    switch (error.response.status) {
      case HttpErrorCode.invalidParameters:
        return ApiErrorMessage.invalidParameters;
      case HttpErrorCode.forbidden:
        return ApiErrorMessage.forbidden;
      case HttpErrorCode.conflict:
        return ApiErrorMessage.conflict;
      case HttpErrorCode.notFound:
        return ApiErrorMessage.notFound;
      default:
        return ApiErrorMessage.internalServerError;
    }
  }
  return ApiErrorMessage.internalServerError;
};


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* handleApiError(error: unknown, failAction: PayloadActionCreator<string, string>, prefix?: ApiErrorPrefix) {
  const errorMessage = getCorrespondingErrorMessage(error);
  yield put(failAction(composeMessage(prefix, errorMessage)));
}
