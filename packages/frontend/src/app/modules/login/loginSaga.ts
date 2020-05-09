/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  all, fork, put, takeEvery,
} from '@redux-saga/core/effects';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { LoginActionName } from 'app/constants/actionNames/login';

import { ApiErrorPrefix, ErrorMessage } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';
import { axiosToken } from 'app/helpers/login/axiosToken';
import { localStorageToken } from 'app/helpers/login/localStorageToken';

import { apiLogin } from 'app/api/calls/login';
import { apiUser } from 'app/api/calls/user';

import { loginAction } from './loginAction';


function* startLoginSaga({ payload: googleTokenId }: ReturnType<typeof loginAction.startLogin>) {
  try {
    const response = yield* callTyped(apiLogin.get, googleTokenId);
    yield put(loginAction.loginSucceeded(response.data));
  } catch (error) {
    yield* handleApiError(error, loginAction.loginFailed, ApiErrorPrefix.login);
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
    yield* handleApiError(error, loginAction.registrationFailed, ApiErrorPrefix.register);
  }
}

function* registrationSucceededSaga({ payload }: ReturnType<typeof loginAction.registrationSucceeded>) {
  yield put(loginAction.startLogin(payload.token));
}

export function* loginSaga() {
  yield all([
    takeEvery(LoginActionName.START_LOGIN, startLoginSaga),
    takeEvery(LoginActionName.LOGIN_SUCCEEDED, loginSucceededSaga),
    takeEvery(LoginActionName.LOGOUT, logoutSaga),
    takeEvery(LoginActionName.START_REGISTRATION, startRegistrationSaga),
    takeEvery(LoginActionName.REGISTRATION_SUCCEEDED, registrationSucceededSaga),
    fork(localStorageLoginSaga),
  ]);
}
