/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { FriendsDataActionName } from 'app/constants/action-names/friends-data';

import { ApiErrorPrefix } from 'app/messages/ErrorMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiBookData } from 'app/api/calls/bookData';

import { friendsDataAction } from './friendsDataAction';
import { apiBookRequest } from '../../api/calls/bookRequest';


function* startReadAllFriendsBookDataSaga() {
  try {
    const response = yield* callTyped(apiBookData.getAllFriendsBookData);
    yield put(friendsDataAction.readAllBookDataWithReviewsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, friendsDataAction.readAllBookDataWithReviewsFailed, ApiErrorPrefix.readAllFriendsBookData);
  }
}

function* startReadAllFriendsBookRequestSaga() {
  try {
    const response = yield* callTyped(apiBookRequest.getAllFriendsBookRequest);
    yield put(friendsDataAction.readAllBookRequestsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, friendsDataAction.readAllBookRequestsFailed, ApiErrorPrefix.readAllFriendsBookRequest);
  }
}

function* refreshSaga() {
  yield all([
    put(friendsDataAction.startReadAllBookDataWithReviews()),
    put(friendsDataAction.startReadAllBookRequests()),
  ]);
}

export const refreshFriendsData: RefreshData = {
  actions: [],
  saga: refreshSaga,
};

export function* friendsDataSaga() {
  yield all([
    takeEvery(FriendsDataActionName.START_READ_ALL_BOOK_DATA_WITH_REVIEWS, startReadAllFriendsBookDataSaga),
    takeEvery(FriendsDataActionName.START_READ_ALL_BOOK_REQUESTS, startReadAllFriendsBookRequestSaga),
  ]);
}
