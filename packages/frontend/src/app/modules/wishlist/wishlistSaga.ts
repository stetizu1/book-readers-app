/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { WishlistActionName } from 'app/constants/action-names/wishlist';

import { SuccessMessage } from 'app/messages/SuccessMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiBookRequest } from 'app/api/calls/bookRequest';
import { apiBook } from 'app/api/calls/book';

import { wishlistAction } from './wishlistAction';
import { apiBookData } from '../../api/calls/bookData';
import { FailActionName } from '../failSaga';
import { libraryAction } from '../library/libraryAction';


function* startReadWishlistSaga() {
  try {
    const response = yield* callTyped(apiBookRequest.getAll);
    yield put(wishlistAction.readWishlistSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, wishlistAction.readWishlistFailed, FailActionName.READ_WISHLIST_FAILED);
  }
}

function* startReadAllBookedBookRequestSaga() {
  try {
    const response = yield* callTyped(apiBookRequest.getAllBooked);
    yield put(wishlistAction.readAllBookedBookRequestsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, wishlistAction.readAllBookedBookRequestsFailed, FailActionName.READ_ALL_BOOKED_BOOK_REQUESTS_FAILED);
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
    yield* handleApiError(error, wishlistAction.createBookRequestFailed, FailActionName.CREATE_BOOK_REQUEST_FAILED);
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
    yield* handleApiError(error, wishlistAction.updateBookRequestFailed, FailActionName.UPDATE_BOOK_REQUEST_FAILED);
  }
}

function* startBookBookRequestSaga({ payload }: ReturnType<typeof wishlistAction.startBookBookRequest>) {
  const {
    id, data,
  } = payload;
  try {
    const bookRequest = (yield* callTyped(apiBookRequest.put, id, { userBookingId: data })).data;
    yield put(wishlistAction.updateBookRequestSucceeded(bookRequest, SuccessMessage.bookBookRequestSucceeded));
  } catch (error) {
    yield* handleApiError(error, wishlistAction.updateBookRequestFailed, FailActionName.BOOK_BOOK_REQUEST_FAILED);
  }
}

function* startDeleteBookRequestSaga({ payload: bookDataId }: ReturnType<typeof wishlistAction.startDeleteBookRequest>) {
  try {
    const response = yield* callTyped(apiBookRequest.delete, bookDataId);
    yield put(wishlistAction.deleteBookRequestSucceeded(response.data, SuccessMessage.deleteBookRequestSucceeded));
  } catch (error) {
    yield* handleApiError(error, wishlistAction.deleteBookRequestFailed, FailActionName.DELETE_BOOK_REQUEST_FAILED);
  }
}

function* startMoveBookToLibrarySaga({ payload }: ReturnType<typeof wishlistAction.startMoveBookToLibrary>) {
  try {
    const {
      id: bookId,
      data: userId,
    } = payload;
    const bookData = (yield* callTyped(apiBookData.put, bookId, { userId })).data;
    yield put(libraryAction.updateBookDataSucceeded(bookData, SuccessMessage.updateBookDataSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.updateBookDataFailed, FailActionName.UPDATE_BOOK_DATA_FAILED);
  }
}

function* refreshSaga() {
  yield all([
    put(wishlistAction.startReadWishlist()),
    put(wishlistAction.startReadAllBookedBookRequests()),
  ]);
}


export const refreshWishlist: RefreshData = {
  actions: [
    WishlistActionName.CREATE_BOOK_REQUEST_SUCCEEDED,
    WishlistActionName.UPDATE_BOOK_REQUEST_SUCCEEDED,
    WishlistActionName.BOOK_BOOK_REQUEST_SUCCEEDED,
    WishlistActionName.DELETE_BOOK_REQUEST_SUCCEEDED,
    WishlistActionName.MOVE_BOOK_TO_LIBRARY_SUCCEEDED,
  ],
  saga: refreshSaga,
};

export function* wishlistSaga() {
  yield all([
    takeEvery(WishlistActionName.START_READ_WISHLIST, startReadWishlistSaga),
    takeEvery(WishlistActionName.START_READ_ALL_BOOKED_BOOK_REQUESTS, startReadAllBookedBookRequestSaga),

    takeEvery(WishlistActionName.START_CREATE_BOOK_REQUEST, startCreateBookRequestSaga),
    takeEvery(WishlistActionName.START_UPDATE_BOOK_REQUEST, startUpdateBookRequestSaga),
    takeEvery(WishlistActionName.START_BOOK_BOOK_REQUEST, startBookBookRequestSaga),
    takeEvery(WishlistActionName.START_DELETE_BOOK_REQUEST, startDeleteBookRequestSaga),
    takeEvery(WishlistActionName.START_MOVE_BOOK_TO_LIBRARY, startMoveBookToLibrarySaga),
  ]);
}
