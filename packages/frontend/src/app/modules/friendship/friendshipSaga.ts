/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { FriendshipActionName } from 'app/constants/action-names/friendship';

import { ApiErrorPrefix } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';


import { apiFriendship } from 'app/api/calls/friendship';
import { apiUser } from 'app/api/calls/user';
import { friendshipAction } from './friendshipAction';

function* startGetFoundUserSaga({ payload: email }: ReturnType<typeof friendshipAction.startGetUserByEmail>) {
  try {
    const response = yield* callTyped(apiUser.getByEmail, email);
    yield put(friendshipAction.getUserByEmailSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, friendshipAction.getUserByEmailFailed, ApiErrorPrefix.getSearchedUser);
  }
}

function* startGetAllFriendshipSaga() {
  try {
    const response = yield* callTyped(apiFriendship.getAll);
    yield put(friendshipAction.getAllFriendshipSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, friendshipAction.getAllFriendshipFailed, ApiErrorPrefix.getAllFriendship);
  }
}

function* startCreateFriendshipSaga({ payload: friendshipCreate }: ReturnType<typeof friendshipAction.startCreateFriendship>) {
  try {
    const friendship = (yield* callTyped(apiFriendship.post, friendshipCreate)).data;
    yield put(friendshipAction.createFriendshipSucceeded(friendship, SuccessMessage.createFriendshipSucceeded));
  } catch (error) {
    yield* handleApiError(error, friendshipAction.createFriendshipFailed, ApiErrorPrefix.createFriendship);
  }
}

function* startConfirmFriendshipSaga({ payload }: ReturnType<typeof friendshipAction.startConfirmFriendship>) {
  const {
    id, data,
  } = payload;
  try {
    const friendship = (yield* callTyped(apiFriendship.put, id, data)).data;
    yield put(friendshipAction.confirmFriendshipSucceeded(friendship, SuccessMessage.updateFriendshipSucceeded));
  } catch (error) {
    yield* handleApiError(error, friendshipAction.confirmFriendshipFailed, ApiErrorPrefix.updateFriendship);
  }
}

function* startDeleteFriendshipSaga({ payload: friendId }: ReturnType<typeof friendshipAction.startDeleteFriendship>) {
  try {
    const response = yield* callTyped(apiFriendship.delete, friendId);
    yield put(friendshipAction.deleteFriendshipSucceeded(response.data, SuccessMessage.deleteFriendshipSucceeded));
  } catch (error) {
    yield* handleApiError(error, friendshipAction.deleteFriendshipFailed, ApiErrorPrefix.deleteFriendship);
  }
}

function* refreshSaga() {
  yield all([
    put(friendshipAction.startGetAllFriendship()),
  ]);
}

export const refreshFriendship: RefreshData = {
  actions: [
    FriendshipActionName.CREATE_FRIENDSHIP_SUCCEEDED,
    FriendshipActionName.CONFIRM_FRIENDSHIP_SUCCEEDED,
    FriendshipActionName.DELETE_FRIENDSHIP_SUCCEEDED,
  ],
  saga: refreshSaga,
};

export function* friendshipSaga() {
  yield all([
    takeEvery(FriendshipActionName.START_GET_ALL_FRIENDS, startGetAllFriendshipSaga),
    takeEvery(FriendshipActionName.START_GET_USER_BY_EMAIL, startGetFoundUserSaga),

    takeEvery(FriendshipActionName.START_CREATE_FRIENDSHIP, startCreateFriendshipSaga),
    takeEvery(FriendshipActionName.START_CONFIRM_FRIENDSHIP, startConfirmFriendshipSaga),
    takeEvery(FriendshipActionName.START_DELETE_FRIENDSHIP, startDeleteFriendshipSaga),
  ]);
}
