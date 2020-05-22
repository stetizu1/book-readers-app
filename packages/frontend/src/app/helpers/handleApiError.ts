import { put } from '@redux-saga/core/effects';
import { EmptyActionCreator, PayloadActionCreator } from 'typesafe-actions';

import { HttpErrorCode } from 'book-app-shared/constants/HttpErrorCode';
import { UnknownType } from 'book-app-shared/types/others/UnknownType';
import {
  isNumber,
  isString,
  isStructure, isUndefined,
  typeCheckFactory,
  TypeCheckFunction,
} from 'book-app-shared/helpers/typeChecks';
import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { GenericApiErrorMessage, ApiError, ApiErrorMessageType } from 'app/messages/ErrorMessage';
import { FailType } from 'app/modules/failSaga';


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

const getCorrespondingErrorMessage = (error: unknown, name: FailType): string => {
  if (isErrorWithResponse(error)) {
    console.error(error.response);
    switch (error.response.status) {
      case HttpErrorCode.invalidParameters:
        return ApiError[name][ApiErrorMessageType.invalidParameters] || GenericApiErrorMessage.invalidParameters;
      case HttpErrorCode.forbidden:
        return ApiError[name][ApiErrorMessageType.forbidden] || GenericApiErrorMessage.forbidden;
      case HttpErrorCode.conflict:
        return ApiError[name][ApiErrorMessageType.conflict] || GenericApiErrorMessage.conflict;
      case HttpErrorCode.notFound:
        return ApiError[name][ApiErrorMessageType.notFound] || GenericApiErrorMessage.notFound;
      default:
        return GenericApiErrorMessage.internalServerError;
    }
  }
  return GenericApiErrorMessage.internalServerError;
};


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* handleApiError(error: unknown, failAction: PayloadActionCreator<string, string> | EmptyActionCreator<string>, name?: FailType) {
  if (isUndefined(name)) {
    yield put((failAction as EmptyActionCreator<string>)());
    return;
  }
  const errorMessage = getCorrespondingErrorMessage(error, name);
  yield put(failAction(composeMessage(ApiError[name][ApiErrorMessageType.prefix], errorMessage)));
}
