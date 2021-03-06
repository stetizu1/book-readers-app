/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { LibraryActionName } from 'app/constants/action-names/library';

import { SuccessMessage } from 'app/messages/SuccessMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';

import { libraryAction } from 'app/modules/library/libraryAction';

import { apiAuthor } from 'app/api/calls/author';
import { apiBook } from 'app/api/calls/book';
import { apiGenre } from 'app/api/calls/genre';
import { apiBookData } from 'app/api/calls/bookData';
import { apiLabel } from 'app/api/calls/label';
import { apiReview } from 'app/api/calls/review';
import { apiPersonalBookData } from 'app/api/calls/personalBookData';
import { FailActionName } from '../failSaga';


function* startReadAllAuthorsSaga() {
  try {
    const response = yield* callTyped(apiAuthor.getAll);
    yield put(libraryAction.readAllAuthorsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.readAllAuthorsFailed, FailActionName.READ_ALL_AUTHORS_FAILED);
  }
}

function* startReadAllBooksSaga() {
  try {
    const response = yield* callTyped(apiBook.getAll);
    yield put(libraryAction.readAllBooksSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.readAllBooksFailed, FailActionName.READ_ALL_BOOKS_FAILED);
  }
}

function* startReadAllGenresSaga() {
  try {
    const response = yield* callTyped(apiGenre.getAll);
    yield put(libraryAction.readAllGenresSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.readAllGenresFailed, FailActionName.READ_ALL_GENRES_FAILED);
  }
}

function* startReadAllBookDataSaga() {
  try {
    const response = yield* callTyped(apiBookData.getAll);
    yield put(libraryAction.readAllBookDataSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.readAllBookDataFailed, FailActionName.READ_ALL_BOOK_DATA_FAILED);
  }
}

function* startReadAllLabelsSaga() {
  try {
    const response = yield* callTyped(apiLabel.getAll);
    yield put(libraryAction.readAllLabelsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.readAllLabelsFailed, FailActionName.READ_ALL_LABELS_FAILED);
  }
}

function* startReadAllReviewsSaga() {
  try {
    const response = yield* callTyped(apiReview.getAll);
    yield put(libraryAction.readAllReviewsSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.readAllReviewsFailed, FailActionName.READ_ALL_REVIEWS_FAILED);
  }
}

function* startReadAllPersonalBookDataSaga() {
  try {
    const response = yield* callTyped(apiPersonalBookData.getAll);
    yield put(libraryAction.readAllPersonalBookDataSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, libraryAction.readAllPersonalBookDataFailed, FailActionName.READ_ALL_PERSONAL_BOOK_DATA_FAILED);
  }
}

function* startCreateBookSaga({ payload }: ReturnType<typeof libraryAction.startCreateBookData>) {
  const {
    bookCreate,
    bookDataCreate,
  } = payload;
  try {
    const book = (yield* callTyped(apiBook.post, bookCreate)).data;
    const bookData = (yield* callTyped(apiBookData.post, {
      bookId: book.id,
      ...bookDataCreate,
    })).data;
    yield put(libraryAction.createBookDataSucceeded(bookData, SuccessMessage.createBookDataSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.createBookDataFailed, FailActionName.CREATE_BOOK_DATA_FAILED);
  }
}

function* startUpdateBookSaga({ payload }: ReturnType<typeof libraryAction.startUpdateBookData>) {
  try {
    const {
      id, data,
    } = payload;
    const bookData = (yield* callTyped(apiBookData.put, id, data.bookDataUpdate)).data;
    yield* callTyped(apiPersonalBookData.put, id, data.personalBookDataUpdate);
    yield* callTyped(apiReview.put, id, data.reviewUpdate);
    yield put(libraryAction.updateBookDataSucceeded(bookData, SuccessMessage.updateBookDataSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.updateBookDataFailed, FailActionName.UPDATE_BOOK_DATA_FAILED);
  }
}

function* startDeleteBookSaga({ payload: bookDataId }: ReturnType<typeof libraryAction.startDeleteBookData>) {
  try {
    const response = yield* callTyped(apiBookData.delete, bookDataId);
    yield put(libraryAction.deleteBookDataSucceeded(response.data, SuccessMessage.deleteBookDataSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.deleteBookDataFailed, FailActionName.DELETE_BOOK_DATA_FAILED);
  }
}

function* startCreateLabelSaga({ payload: labelCreate }: ReturnType<typeof libraryAction.startCreateLabel>) {
  try {
    const label = (yield* callTyped(apiLabel.post, labelCreate)).data;
    yield put(libraryAction.createLabelSucceeded(label, SuccessMessage.createLabelSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.createLabelFailed, FailActionName.CREATE_LABEL_FAILED);
  }
}

function* startUpdateLabelSaga({ payload }: ReturnType<typeof libraryAction.startUpdateLabel>) {
  try {
    const {
      id,
      data: labelUpdate,
    } = payload;
    const label = (yield* callTyped(apiLabel.put, id, labelUpdate)).data;
    yield put(libraryAction.updateLabelSucceeded(label, SuccessMessage.updateLabelSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.updateLabelFailed, FailActionName.UPDATE_LABEL_FAILED);
  }
}

function* startDeleteLabelSaga({ payload: labelId }: ReturnType<typeof libraryAction.startDeleteLabel>) {
  try {
    const response = (yield* callTyped(apiLabel.delete, labelId)).data;
    yield put(libraryAction.deleteLabelSucceeded(response, SuccessMessage.deleteLabelSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.deleteLabelFailed, FailActionName.DELETE_LABEL_FAILED);
  }
}

function* refreshSaga() {
  yield all([
    put(libraryAction.startReadAllAuthors()),
    put(libraryAction.startReadAllBooks()),
    put(libraryAction.startReadAllGenres()),
    put(libraryAction.startReadAllBookData()),
    put(libraryAction.startReadAllLabels()),
    put(libraryAction.startReadAllReviews()),
    put(libraryAction.startReadAllPersonalBookData()),
  ]);
}

export const refreshLibrary: RefreshData = {
  actions: [
    LibraryActionName.CREATE_BOOK_DATA_SUCCEEDED,
    LibraryActionName.UPDATE_BOOK_DATA_SUCCEEDED,
    LibraryActionName.DELETE_BOOK_DATA_SUCCEEDED,

    LibraryActionName.CREATE_LABEL_SUCCEEDED,
    LibraryActionName.UPDATE_LABEL_SUCCEEDED,
    LibraryActionName.DELETE_LABEL_SUCCEEDED,
  ],
  saga: refreshSaga,
};

export function* librarySaga() {
  yield all([
    takeEvery(LibraryActionName.START_READ_ALL_AUTHORS, startReadAllAuthorsSaga),
    takeEvery(LibraryActionName.START_READ_ALL_BOOKS, startReadAllBooksSaga),
    takeEvery(LibraryActionName.START_READ_ALL_GENRES, startReadAllGenresSaga),
    takeEvery(LibraryActionName.START_READ_ALL_BOOK_DATA, startReadAllBookDataSaga),
    takeEvery(LibraryActionName.START_READ_ALL_LABELS, startReadAllLabelsSaga),
    takeEvery(LibraryActionName.START_READ_ALL_REVIEWS, startReadAllReviewsSaga),
    takeEvery(LibraryActionName.START_READ_ALL_PERSONAL_BOOK_DATA, startReadAllPersonalBookDataSaga),

    takeEvery(LibraryActionName.START_CREATE_BOOK_DATA, startCreateBookSaga),
    takeEvery(LibraryActionName.START_UPDATE_BOOK_DATA, startUpdateBookSaga),
    takeEvery(LibraryActionName.START_DELETE_BOOK_DATA, startDeleteBookSaga),

    takeEvery(LibraryActionName.START_CREATE_LABEL, startCreateLabelSaga),
    takeEvery(LibraryActionName.START_UPDATE_LABEL, startUpdateLabelSaga),
    takeEvery(LibraryActionName.START_DELETE_LABEL, startDeleteLabelSaga),
  ]);
}
