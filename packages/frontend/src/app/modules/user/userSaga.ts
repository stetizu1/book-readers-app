/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { UserActionName } from 'app/constants/action-names/user';

import { ErrorMessage } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped, selectTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiUser } from 'app/api/calls/user';

import { loginSelector } from '../login/loginSelector';
import { loginAction } from '../login/loginAction';

import { userAction } from './userAction';
import { FailActionName } from '../failSaga';


function* startReadCurrentUserSaga() {
  const currentUserId = yield* selectTyped(loginSelector.getLoggedUserId);
  if (isUndefined(currentUserId)) {
    yield put(userAction.readCurrentUserFailed(ErrorMessage.noCurrentUser));
    return;
  }

  try {
    const response = yield* callTyped(apiUser.get, currentUserId);
    yield put(userAction.readCurrentUserSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, userAction.readCurrentUserFailed, FailActionName.READ_CURRENT_USER_FAILED);
  }
}

function* startReadUsersSaga() {
  try {
    const response = yield* callTyped(apiUser.getAll);
    yield put(userAction.readUsersSucceeded(response.data));
  } catch (error) {
    yield* handleApiError(error, userAction.readUsersFailed, FailActionName.READ_ALL_USERS_FAILED);
  }
}

function* startUpdateSaga({ payload }: ReturnType<typeof userAction.startUpdateUser>) {
  try {
    const { id: userId, data: userUpdate } = payload;
    const response = yield* callTyped(apiUser.put, userId, userUpdate);
    yield put(userAction.updateUserSucceeded(response.data, SuccessMessage.updateUserSucceeded));
  } catch (error) {
    yield* handleApiError(error, userAction.updateUserFailed, FailActionName.UPDATE_USER_FAILED);
  }
}

function* startDeleteSaga({ payload: userId }: ReturnType<typeof userAction.startDeleteUser>) {
  try {
    const response = yield* callTyped(apiUser.delete, userId);
    yield put(userAction.deleteUserSucceeded(response.data, SuccessMessage.deleteUserSucceeded));
  } catch (error) {
    yield* handleApiError(error, userAction.deleteUserFailed, FailActionName.DELETE_USER_FAILED);
  }
}

function* refreshSaga() {
  yield all([
    put(userAction.startReadCurrentUser()),
    put(userAction.startReadUsers()),
  ]);
}

function* deleteSucceededSaga() {
  yield put(loginAction.logout());
}

export const refreshUser: RefreshData = {
  actions: [
    UserActionName.UPDATE_USER_SUCCEEDED,
    UserActionName.UPDATE_USER_FAILED,
  ],
  saga: refreshSaga,
};

export function* userSaga() {
  yield all([
    takeEvery(UserActionName.START_READ_CURRENT_USER, startReadCurrentUserSaga),
    takeEvery(UserActionName.START_READ_ALL_USERS, startReadUsersSaga),
    takeEvery(UserActionName.START_UPDATE_USER, startUpdateSaga),
    takeEvery(UserActionName.START_DELETE_USER, startDeleteSaga),
    takeEvery(UserActionName.DELETE_USER_SUCCEEDED, deleteSucceededSaga),
  ]);
}
