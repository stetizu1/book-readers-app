/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { UserActionName } from 'app/constants/action-names/user';

import { ApiErrorPrefix, ErrorMessage } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

import { callTyped, selectTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiUser } from 'app/api/calls/user';

import { loginSelector } from '../login/loginSelector';
import { loginAction } from '../login/loginAction';

import { userAction } from './userAction';
import { RefreshData } from '../../types/RefreshData';


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

function* startGetUsersSaga() {
  try {
    const response = yield* callTyped(apiUser.getAll);
    yield put(userAction.getUsersSucceeded(response.data));
  } catch (error) {
    yield* handleApiError(error, userAction.getUsersFailed, ApiErrorPrefix.getUsers);
  }
}

function* startUpdateSaga({ payload }: ReturnType<typeof userAction.startUpdateUser>) {
  try {
    const { id: userId, data: userUpdate } = payload;
    const response = yield* callTyped(apiUser.put, userId, userUpdate);
    yield put(userAction.updateUserSucceeded(response.data, SuccessMessage.updateUserSucceeded));
  } catch (error) {
    yield* handleApiError(error, userAction.updateUserFailed, ApiErrorPrefix.updateUser);
  }
}

function* startDeleteSaga({ payload: userId }: ReturnType<typeof userAction.startDeleteUser>) {
  try {
    const response = yield* callTyped(apiUser.delete, userId);
    yield put(userAction.deleteUserSucceeded(response.data, SuccessMessage.deleteUserSucceeded));
  } catch (error) {
    yield* handleApiError(error, userAction.deleteUserFailed, ApiErrorPrefix.deleteUser);
  }
}

function* refreshSaga() {
  yield all([
    put(userAction.startGetCurrentUser()),
    put(userAction.startGetUsers()),
  ]);
}

function* deleteSucceededSaga() {
  yield put(loginAction.logout());
}

export const refreshUser: RefreshData = {
  actions: [
    UserActionName.UPDATE_SUCCEEDED,
    UserActionName.UPDATE_FAILED,
  ],
  saga: refreshSaga,
};

export function* userSaga() {
  yield all([
    takeEvery(UserActionName.START_GET_CURRENT_USER, startGetCurrentUserSaga),
    takeEvery(UserActionName.START_GET_USERS, startGetUsersSaga),
    takeEvery(UserActionName.START_UPDATE, startUpdateSaga),
    takeEvery(UserActionName.START_DELETE, startDeleteSaga),
    takeEvery(UserActionName.DELETE_SUCCEEDED, deleteSucceededSaga),
  ]);
}
