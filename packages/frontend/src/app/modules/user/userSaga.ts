/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { UserActionName } from 'app/constants/actionNames/user';

import { ApiErrorPrefix, ErrorMessage } from 'app/messages/ErrorMessage';
import { SuccessMessages } from 'app/messages/SuccessMessages';

import { callTyped, selectTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiUser } from 'app/api/calls/user';

import { loginSelector } from '../login/loginSelector';
import { loginAction } from '../login/loginAction';

import { userAction } from './userAction';


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
    yield handleApiError(error, userAction.getCurrentUserFailed, ApiErrorPrefix.getCurrentUser);
  }
}

function* startGetPublicUsersSaga() {
  try {
    const response = yield* callTyped(apiUser.getAll);
    yield put(userAction.getPublicUsersSucceeded(response.data));
  } catch (error) {
    yield* handleApiError(error, userAction.getPublicUsersFailed, ApiErrorPrefix.getPublicUsers);
  }
}

function* startUpdateSaga({ payload }: ReturnType<typeof userAction.startUpdateUser>) {
  try {
    const { id: userId, data: userUpdate } = payload;
    const response = yield* callTyped(apiUser.put, userId, userUpdate);
    yield put(userAction.updateUserSucceeded(response.data, SuccessMessages.updateUserSucceeded));
  } catch (error) {
    yield* handleApiError(error, userAction.updateUserFailed, ApiErrorPrefix.updateUser);
  }
}

function* startDeleteSaga({ payload: userId }: ReturnType<typeof userAction.startDeleteUser>) {
  try {
    const response = yield* callTyped(apiUser.delete, userId);
    yield put(userAction.deleteUserSucceeded(response.data, SuccessMessages.deleteUserSucceeded));
  } catch (error) {
    yield* handleApiError(error, userAction.deleteUserFailed, ApiErrorPrefix.deleteUser);
  }
}

function* updateEndedSaga() {
  yield put(userAction.startGetCurrentUser());
  yield put(userAction.startGetPublicUsers());
}

function* deleteSucceededSaga() {
  yield put(loginAction.logout());
}

export function* userSaga() {
  yield all([
    takeEvery(UserActionName.START_GET_CURRENT_USER, startGetCurrentUserSaga),
    takeEvery(UserActionName.START_GET_PUBLIC_USERS, startGetPublicUsersSaga),
    takeEvery(UserActionName.START_UPDATE, startUpdateSaga),
    takeEvery(UserActionName.START_DELETE, startDeleteSaga),
    takeEvery([UserActionName.UPDATE_SUCCEEDED, UserActionName.UPDATE_FAILED], updateEndedSaga),
    takeEvery(UserActionName.DELETE_SUCCEEDED, deleteSucceededSaga),
  ]);
}
