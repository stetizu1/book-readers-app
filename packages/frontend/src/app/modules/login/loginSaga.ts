/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  all, fork, put, takeEvery,
} from '@redux-saga/core/effects';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { LoginActionName } from 'app/constants/action-names/login';

import { ApiError, ApiErrorMessageType, ErrorMessage } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';
import { axiosToken } from 'app/helpers/login/axiosToken';
import { localStorageToken } from 'app/helpers/login/localStorageToken';

import { apiLogin } from 'app/api/calls/login';
import { apiUser } from 'app/api/calls/user';

import { loginAction } from './loginAction';
import { FailActionName } from '../failSaga';
import { friendshipAction } from '../friendship/friendshipAction';


function* startCheckUserNotExistsSaga({ payload: email }: ReturnType<typeof friendshipAction.startReadUserByEmail>) {
  try {
    yield* callTyped(apiUser.getByEmail, email);
    const failName = FailActionName.CHECK_USER_NOT_EXISTS_FAILED;
    yield put(loginAction.checkUserNotExistsFailed(composeMessage(ApiError[failName][ApiErrorMessageType.prefix], ApiError[failName][ApiErrorMessageType.conflict])));
  } catch (error) {
    yield put(loginAction.checkUserNotExistsSucceeded());
  }
}

function* startLoginSaga({ payload: googleTokenId }: ReturnType<typeof loginAction.startLogin>) {
  try {
    const response = yield* callTyped(apiLogin.get, googleTokenId);
    yield put(loginAction.loginSucceeded(response.data));
  } catch (error) {
    yield* handleApiError(error, loginAction.loginFailed, FailActionName.LOGIN_FAILED);
  }
}

function loginSucceededSaga({ payload: token }: ReturnType<typeof loginAction.loginSucceeded>) {
  localStorageToken.set(token);
  axiosToken.set(token);
}

function logoutSaga() {
  localStorageToken.remove();
  axiosToken.remove();
}

function* localStorageLoginSaga() {
  const persistedToken = localStorageToken.get();
  if (!isNull(persistedToken)) {
    yield put(loginAction.loginSucceeded(persistedToken));
  }
}

function* startRegistrationSaga({ payload: userCreate }: ReturnType<typeof loginAction.startRegistration>) {
  const googleToken = userCreate.googleToken;
  if (isUndefined(googleToken)) {
    yield put(loginAction.registrationFailed(ErrorMessage.noGoogleToken));
    return;
  }

  try {
    yield* callTyped(apiUser.post, userCreate);
    yield put(loginAction.registrationSucceeded({ token: googleToken }, SuccessMessage.createUserSucceeded));
  } catch (error) {
    yield* handleApiError(error, loginAction.registrationFailed, FailActionName.REGISTRATION_FAILED);
  }
}

function* registrationSucceededSaga({ payload }: ReturnType<typeof loginAction.registrationSucceeded>) {
  yield put(loginAction.startLogin(payload.data.token));
}

export const refreshLogin: RefreshData = {
  actions: [
    LoginActionName.LOGIN_SUCCEEDED,
  ],
};

export function* loginSaga() {
  yield all([
    takeEvery(LoginActionName.START_CHECK_USER_NOT_EXISTS, startCheckUserNotExistsSaga),
    takeEvery(LoginActionName.START_LOGIN, startLoginSaga),
    takeEvery(LoginActionName.LOGIN_SUCCEEDED, loginSucceededSaga),
    takeEvery(LoginActionName.LOGOUT, logoutSaga),
    takeEvery(LoginActionName.START_REGISTRATION, startRegistrationSaga),
    takeEvery(LoginActionName.REGISTRATION_SUCCEEDED, registrationSucceededSaga),
    fork(localStorageLoginSaga),
  ]);
}
