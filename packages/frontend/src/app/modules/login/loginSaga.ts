/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  all, fork, put, takeEvery,
} from '@redux-saga/core/effects';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { LoginActionName } from '../../constants/actionNames/login';
import { localStorageToken } from '../../helpers/login/localStorageToken';
import { axiosToken } from '../../helpers/login/axiosToken';
import { loginAction } from './loginAction';
import { apiLogin } from '../../api/calls/login';
import { ErrorMessage } from '../../messages/ErrorMessage';
import { userAction } from '../user/userAction';
import { callTyped } from '../../helpers/saga/typedEffects';
import { apiUser } from '../../api/calls/user';


function* startLoginSaga({ payload: googleTokenId }: ReturnType<typeof loginAction.startLogin>) {
  try {
    const response = yield* callTyped(apiLogin.get, googleTokenId);
    yield put(loginAction.loginSucceeded(response.data));
  } catch (error) {
    // todo error handling
    if ('response' in error && typeof error.response.data === 'string') {
      console.error(error.response);
      yield put(loginAction.loginFailed(ErrorMessage.failed));
    } else {
      console.error(error);
      yield put(loginAction.loginFailed(ErrorMessage.failed));
    }
  }
}

function* loginSucceededSaga({ payload: token }: ReturnType<typeof loginAction.loginSucceeded>) {
  localStorageToken.set(token);
  axiosToken.set(token);

  yield all([
    put(userAction.startGetCurrentUser()),
    put(userAction.startGetPublicUsers()),
  ]);
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
    yield put(loginAction.registrationSucceeded(googleToken));
  } catch {
    yield put(loginAction.loginFailed(ErrorMessage.failed));
  }
}

function* registrationSucceededSaga({ payload: googleTokenId }: ReturnType<typeof loginAction.registrationSucceeded>) {
  yield put(loginAction.startLogin(googleTokenId));
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
