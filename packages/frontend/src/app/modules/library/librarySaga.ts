/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { Author } from 'book-app-shared/types/Author';
import { Label } from 'book-app-shared/types/Label';
import { isBookDataWithLabelsIds } from 'book-app-shared/types/BookData';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { LibraryActionName } from 'app/constants/action-names/library';
import { ApiErrorPrefix } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

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
import { LoginActionName } from 'app/constants/action-names/login';


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

function* startUpdateSaga({ payload }: ReturnType<typeof libraryAction.startUpdateBookData>) {
  try {
    const {
      id, data,
    } = payload;
    const bookData = (yield* callTyped(apiBookData.put, id, data.bookDataUpdate)).data;
    yield* callTyped(apiPersonalBookData.put, id, data.personalBookDataUpdate);
    yield* callTyped(apiReview.put, id, data.reviewUpdate);
    yield put(libraryAction.startGetBookData(bookData.id));
    yield put(libraryAction.updateBookDataSucceeded(bookData, SuccessMessage.updateBookDataSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.updateBookDataFailed, ApiErrorPrefix.updateBookData);
  }
}

function* startGetBookDataSaga({ payload: bookDataId }: ReturnType<typeof libraryAction.startGetBookData>) {
  try {
    const bookData = (yield* callTyped(apiBookData.get, bookDataId)).data;
    const book = (yield* callTyped(apiBook.get, bookData.bookId)).data;

    const authors: Author[] = [];
    for (let i = 0; i < book.authorIds.length; i++) {
      authors.push((yield* callTyped(apiAuthor.get, book.authorIds[i])).data);
    }

    const labels: Label[] = [];
    if (isBookDataWithLabelsIds(bookData)) {
      for (let i = 0; i < bookData.labelsIds.length; i++) {
        labels.push((yield* callTyped(apiLabel.get, bookData.labelsIds[i])).data);
      }
    }

    const genre = (!isNull(bookData.genreId))
      ? (yield* callTyped(apiGenre.get, bookData.genreId)).data
      : null;
    const personalBookData = (yield* callTyped(apiPersonalBookData.get, bookData.id)).data;
    const review = (yield* callTyped(apiReview.get, bookData.id)).data;

    yield put(libraryAction.getBookDataSucceeded(bookData, book, authors, labels, genre, personalBookData, review));
  } catch (error) {
    yield handleApiError(error, libraryAction.getBookDataFailed, ApiErrorPrefix.getBookData);
  }
}

function* startDeleteSaga({ payload: bookDataId }: ReturnType<typeof libraryAction.startDeleteBookData>) {
  try {
    const response = yield* callTyped(apiBookData.delete, bookDataId);
    yield put(libraryAction.deleteBookDataSucceeded(response.data, SuccessMessage.deleteBookDataSucceeded));
  } catch (error) {
    yield* handleApiError(error, libraryAction.deleteBookDataFailed, ApiErrorPrefix.deleteBookData);
  }
}

function* updateSaga() {
  yield all([
    put(libraryAction.startGetAllAuthors()),
    put(libraryAction.startGetAllBooks()),
    put(libraryAction.startGetAllGenres()),
    put(libraryAction.startGetAllBookData()),
    put(libraryAction.startGetAllLabels()),
    put(libraryAction.startGetAllReviews()),
    put(libraryAction.startGetAllPersonalBookData()),
  ]);
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
    takeEvery(LibraryActionName.START_GET_BOOK_DATA, startGetBookDataSaga),
    takeEvery(LibraryActionName.START_UPDATE_BOOK_DATA, startUpdateSaga),
    takeEvery(LibraryActionName.START_DELETE_BOOK_DATA, startDeleteSaga),
    takeEvery([LibraryActionName.UPDATE_BOOK_DATA_SUCCEEDED, LibraryActionName.DELETE_BOOK_DATA_SUCCEEDED, LoginActionName.LOGIN_SUCCEEDED], updateSaga),
  ]);
}
