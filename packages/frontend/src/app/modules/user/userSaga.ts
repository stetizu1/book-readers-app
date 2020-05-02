/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  all, put, takeEvery,
} from '@redux-saga/core/effects';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { apiUser } from '../../api/calls/user';
import { loginSelector } from '../login/loginSelector';
import { userAction } from './userAction';
import { ErrorMessage } from '../../messages/ErrorMessage';
import { UserActionName } from '../../constants/actionNames/user';
import { callTyped, selectTyped } from '../../helpers/saga/typedEffects';

function* startGetCurrentUserSaga() {
  const currentUserId = yield* selectTyped(loginSelector.getLoggedUserId);
  if (isUndefined(currentUserId)) {
    yield put(userAction.getCurrentUserFailed(ErrorMessage.noCurrentUser));
    return;
  }

  try {
    const response = yield* callTyped(apiUser.get, currentUserId);
    yield put(userAction.getCurrentUserSucceeded(response.data));
  } catch (error) {
    yield put(userAction.getCurrentUserFailed(ErrorMessage.failed));
  }
}

function* startGetPublicUsersSaga() {
  try {
    const response = yield* callTyped(apiUser.getAll);
    yield put(userAction.getPublicUsersSucceeded(response.data));
  } catch (error) {
    yield put(userAction.getPublicUsersFailed(ErrorMessage.failed));
  }
}

export function* userSaga() {
  yield all([
    takeEvery(UserActionName.START_GET_CURRENT_USER, startGetCurrentUserSaga),
    takeEvery(UserActionName.START_GET_PUBLIC_USERS, startGetPublicUsersSaga),
  ]);
}
