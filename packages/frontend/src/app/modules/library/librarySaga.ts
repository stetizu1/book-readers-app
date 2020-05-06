/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { LibraryActionName } from 'app/constants/actionNames/library';

import { ApiErrorPrefix } from 'app/messages/ErrorMessage';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { apiAuthor } from 'app/api/calls/author';
import { apiBook } from 'app/api/calls/book';
import { apiGenre } from 'app/api/calls/genre';
import { apiBookData } from 'app/api/calls/bookData';
import { apiLabel } from 'app/api/calls/label';

import { libraryAction } from 'app/modules/library/libraryAction';
import { apiReview } from 'app/api/calls/review';
import { apiPersonalBookData } from 'app/api/calls/personalBookData';


function* startGetAllAuthorsSaga() {
  try {
    const response = yield* callTyped(apiAuthor.getAll);
    yield put(libraryAction.getAllAuthorsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.getAllAuthorsFailed, ApiErrorPrefix.getAllAuthors);
  }
}

function* startGetAllBooksSaga() {
  try {
    const response = yield* callTyped(apiBook.getAll);
    yield put(libraryAction.getAllBooksSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.getAllBooksFailed, ApiErrorPrefix.getAllBooks);
  }
}

function* startGetAllGenresSaga() {
  try {
    const response = yield* callTyped(apiGenre.getAll);
    yield put(libraryAction.getAllGenresSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.getAllGenresFailed, ApiErrorPrefix.getAllGenres);
  }
}

function* startGetAllBookDataSaga() {
  try {
    const response = yield* callTyped(apiBookData.getAll);
    yield put(libraryAction.getAllBookDataSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.getAllBookDataFailed, ApiErrorPrefix.getAllBookData);
  }
}

function* startGetAllLabelsSaga() {
  try {
    const response = yield* callTyped(apiLabel.getAll);
    yield put(libraryAction.getAllLabelsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.getAllLabelsFailed, ApiErrorPrefix.getAllLabels);
  }
}

function* startGetAllReviewsSaga() {
  try {
    const response = yield* callTyped(apiReview.getAll);
    yield put(libraryAction.getAllReviewsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.getAllReviewsFailed, ApiErrorPrefix.getAllReviews);
  }
}

function* startGetAllPersonalBookDataSaga() {
  try {
    const response = yield* callTyped(apiPersonalBookData.getAll);
    yield put(libraryAction.getAllPersonalBookDataSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.getAllPersonalBookDataFailed, ApiErrorPrefix.getAllPersonalBookData);
  }
}


export function* librarySaga() {
  yield all([
    takeEvery(LibraryActionName.START_GET_ALL_AUTHORS, startGetAllAuthorsSaga),
    takeEvery(LibraryActionName.START_GET_ALL_BOOKS, startGetAllBooksSaga),
    takeEvery(LibraryActionName.START_GET_ALL_GENRES, startGetAllGenresSaga),
    takeEvery(LibraryActionName.START_GET_ALL_BOOK_DATA, startGetAllBookDataSaga),
    takeEvery(LibraryActionName.START_GET_ALL_LABELS, startGetAllLabelsSaga),
    takeEvery(LibraryActionName.START_GET_ALL_REVIEWS, startGetAllReviewsSaga),
    takeEvery(LibraryActionName.START_GET_ALL_PERSONAL_BOOK_DATA, startGetAllPersonalBookDataSaga),
  ]);
}
