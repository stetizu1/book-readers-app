/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { FriendsDataActionName } from 'app/constants/action-names/friends-data';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiBookData } from 'app/api/calls/bookData';

import { friendsDataAction } from './friendsDataAction';
import { apiBookRequest } from '../../api/calls/bookRequest';
import { FailActionName } from '../failSaga';


function* startReadAllFriendsBookDataSaga() {
  try {
    const response = yield* callTyped(apiBookData.getAllFriendsBookData);
    yield put(friendsDataAction.readAllBookDataWithReviewsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, friendsDataAction.readAllBookDataWithReviewsFailed, FailActionName.READ_ALL_FRIENDS_BOOK_DATA_WITH_REVIEWS_FAILED);
  }
}

function* startReadAllFriendsBookRequestSaga() {
  try {
    const response = yield* callTyped(apiBookRequest.getAllFriendsBookRequest);
    yield put(friendsDataAction.readAllBookRequestsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, friendsDataAction.readAllBookRequestsFailed, FailActionName.READ_ALL_FRIENDS_BOOK_REQUESTS_FAILED);
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
    takeEvery(FriendsDataActionName.START_READ_ALL_FRIENDS_BOOK_DATA_WITH_REVIEWS, startReadAllFriendsBookDataSaga),
    takeEvery(FriendsDataActionName.START_READ_ALL_FRIENDS_BOOK_REQUESTS, startReadAllFriendsBookRequestSaga),
  ]);
}
