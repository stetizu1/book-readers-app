/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';
import { toast } from 'react-toastify';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { UserActionName } from '../../constants/actionNames/user';

import { ApiErrorPrefix, ErrorMessage } from '../../messages/ErrorMessage';
import { SuccessMessages } from '../../messages/SuccessMessages';

import { callTyped, selectTyped } from '../../helpers/saga/typedEffects';
import { handleApiError } from '../../helpers/handleApiError';

import { apiUser } from '../../api/calls/user';

import { userAction } from './userAction';

import { loginSelector } from '../login/loginSelector';
import { loginAction } from '../login/loginAction';


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

function* startDeleteSaga({ payload: userId }: ReturnType<typeof userAction.startDeleteUser>) {
  try {
    const response = yield* callTyped(apiUser.delete, userId);
    yield put(userAction.deleteUserSucceeded(response.data));
  } catch (error) {
    yield* handleApiError(error, userAction.deleteUserFailed, ApiErrorPrefix.deleteUser);
  }
}

function* deleteSucceededSaga() {
  toast(SuccessMessages.deleteUserSucceeded, {
    type: toast.TYPE.SUCCESS,
  });
  yield put(loginAction.logout());
}

export function* userSaga() {
  yield all([
    takeEvery(UserActionName.START_GET_CURRENT_USER, startGetCurrentUserSaga),
    takeEvery(UserActionName.START_GET_PUBLIC_USERS, startGetPublicUsersSaga),
    takeEvery(UserActionName.START_DELETE, startDeleteSaga),
    takeEvery(UserActionName.DELETE_SUCCEEDED, deleteSucceededSaga),
  ]);
}
