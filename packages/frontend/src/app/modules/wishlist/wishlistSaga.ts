/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { WishlistActionName } from 'app/constants/action-names/wishlist';

import { ApiErrorPrefix } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiBookRequest } from 'app/api/calls/bookRequest';
import { apiBook } from 'app/api/calls/book';

import { wishlistAction } from './wishlistAction';
import { apiBookData } from '../../api/calls/bookData';


function* startGetWishlistSaga() {
  try {
    const response = yield* callTyped(apiBookRequest.getAll);
    yield put(wishlistAction.getWishlistSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, wishlistAction.getWishlistFailed, ApiErrorPrefix.getWishlist);
  }
}

function* startGetAllBookedBookRequestSaga() {
  try {
    const response = yield* callTyped(apiBookRequest.getAllBooked);
    yield put(wishlistAction.getWishlistSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, wishlistAction.getWishlistFailed, ApiErrorPrefix.getAllBookedBookRequests);
  }
}

function* startCreateBookRequestSaga({ payload }: ReturnType<typeof wishlistAction.startCreateBookRequest>) {
  const { bookRequestCreate, bookCreate } = payload;
  try {
    const book = (yield* callTyped(apiBook.post, bookCreate)).data;
    const bookRequestCreateWithBookId = {
      ...bookRequestCreate,
      bookData: {
        bookId: book.id,
        ...bookRequestCreate.bookData,
      },
    };
    const bookRequest = (yield* callTyped(apiBookRequest.post, bookRequestCreateWithBookId)).data;
    yield put(wishlistAction.createBookRequestSucceeded(bookRequest, SuccessMessage.createBookRequestSucceeded));
  } catch (error) {
    yield* handleApiError(error, wishlistAction.createBookRequestFailed, ApiErrorPrefix.createBookRequest);
  }
}

function* startUpdateBookRequestSaga({ payload }: ReturnType<typeof wishlistAction.startUpdateBookRequest>) {
  const {
    id, data,
  } = payload;
  const {
    bookDataUpdate,
    bookRequestUpdate,
  } = data;
  try {
    yield* callTyped(apiBookData.put, id, bookDataUpdate);
    const bookRequest = (yield* callTyped(apiBookRequest.put, id, bookRequestUpdate)).data;
    yield put(wishlistAction.updateBookRequestSucceeded(bookRequest, SuccessMessage.updateBookRequestSucceeded));
  } catch (error) {
    yield* handleApiError(error, wishlistAction.updateBookRequestFailed, ApiErrorPrefix.updateBookRequest);
  }
}

function* startDeleteBookRequestSaga({ payload: bookDataId }: ReturnType<typeof wishlistAction.startDeleteBookRequest>) {
  try {
    const response = yield* callTyped(apiBookRequest.delete, bookDataId);
    yield put(wishlistAction.deleteBookRequestSucceeded(response.data, SuccessMessage.deleteBookRequestSucceeded));
  } catch (error) {
    yield* handleApiError(error, wishlistAction.deleteBookRequestFailed, ApiErrorPrefix.deleteBookRequest);
  }
}

function* refreshSaga() {
  yield all([
    put(wishlistAction.startGetWishlist()),
    put(wishlistAction.startGetAllBookedBookRequests()),
  ]);
}


export const refreshWishlist: RefreshData = {
  actions: [
    WishlistActionName.CREATE_BOOK_REQUEST_SUCCEEDED,
    WishlistActionName.UPDATE_BOOK_REQUEST_SUCCEEDED,
    WishlistActionName.DELETE_BOOK_REQUEST_SUCCEEDED,
  ],
  saga: refreshSaga,
};

export function* wishlistSaga() {
  yield all([
    takeEvery(WishlistActionName.START_GET_WISHLIST, startGetWishlistSaga),
    takeEvery(WishlistActionName.START_GET_ALL_BOOKED_BOOK_REQUESTS, startGetAllBookedBookRequestSaga),

    takeEvery(WishlistActionName.START_CREATE_BOOK_REQUEST, startCreateBookRequestSaga),
    takeEvery(WishlistActionName.START_UPDATE_BOOK_REQUEST, startUpdateBookRequestSaga),
    takeEvery(WishlistActionName.START_DELETE_BOOK_REQUEST, startDeleteBookRequestSaga),
  ]);
}
