/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, call, takeEvery } from '@redux-saga/core/effects';

import { isNotUndefined } from 'book-app-shared/helpers/typeChecks';

import { refreshFriendship } from './friendship/friendshipSaga';
import { refreshLibrary } from './library/librarySaga';
import { refreshLogin } from './login/loginSaga';
import { refreshUser } from './user/userSaga';
import { refreshWishlist } from './wishlist/wishlistSaga';

const refreshData = [
  refreshFriendship,
  refreshLibrary,
  refreshLogin,
  refreshUser,
  refreshWishlist,
];

const refreshActions = refreshData.reduce(
  (actions: string[], data) => [...actions, ...data.actions],
  [],
);

const refreshSagas = refreshData
  .map((data) => data.saga)
  .filter(isNotUndefined);

function* refreshAllSaga() {
  yield all(refreshSagas.map((saga) => call(saga)));
}

export function* refreshSaga() {
  yield takeEvery(refreshActions, refreshAllSaga);
}
