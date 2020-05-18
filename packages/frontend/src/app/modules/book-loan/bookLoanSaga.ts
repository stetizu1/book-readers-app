/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all, put, takeEvery } from '@redux-saga/core/effects';

import { BookLoanActionName } from 'app/constants/action-names/bookLoan';

import { ApiErrorPrefix } from 'app/messages/ErrorMessage';
import { SuccessMessage } from 'app/messages/SuccessMessage';

import { RefreshData } from 'app/types/RefreshData';

import { callTyped } from 'app/helpers/saga/typedEffects';
import { handleApiError } from 'app/helpers/handleApiError';


import { apiBorrowed } from 'app/api/calls/borrowed';
import { bookLoanAction } from './bookLoanAction';

function* startReadAllBookLoansSaga() {
  try {
    const response = yield* callTyped(apiBorrowed.getAll);
    yield put(bookLoanAction.readAllBookLoansSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, bookLoanAction.readAllBookLoansFailed, ApiErrorPrefix.readAllBookLoans);
  }
}

function* startReadAllBorrowedSaga() {
  try {
    const response = yield* callTyped(apiBorrowed.getAllToUser);
    yield put(bookLoanAction.readAllBorrowedSucceeded(response.data));
  } catch (error) {
    yield handleApiError(error, bookLoanAction.readAllBorrowedFailed, ApiErrorPrefix.readAllBorrowed);
  }
}

function* startCreateBookLoanSaga({ payload: bookLoanCreate }: ReturnType<typeof bookLoanAction.startCreateBookLoan>) {
  try {
    const bookLoan = (yield* callTyped(apiBorrowed.post, bookLoanCreate)).data;
    yield put(bookLoanAction.createBookLoanSucceeded(bookLoan, SuccessMessage.createBookLoanSucceeded));
  } catch (error) {
    yield* handleApiError(error, bookLoanAction.createBookLoanFailed, ApiErrorPrefix.createBookLoan);
  }
}

function* startUpdateBookLoanSaga({ payload }: ReturnType<typeof bookLoanAction.startUpdateBookLoan>) {
  const {
    id, data,
  } = payload;
  try {
    const bookLoan = (yield* callTyped(apiBorrowed.put, id, data)).data;
    yield put(bookLoanAction.updateBookLoanSucceeded(bookLoan, SuccessMessage.updateBookLoanSucceeded));
  } catch (error) {
    yield* handleApiError(error, bookLoanAction.updateBookLoanFailed, ApiErrorPrefix.updateBookLoan);
  }
}

function* startReturnBorrowedSaga({ payload: id }: ReturnType<typeof bookLoanAction.startReturnBorrowed>) {
  try {
    const bookLoan = (yield* callTyped(apiBorrowed.put, id, { returned: true })).data;
    yield put(bookLoanAction.returnBorrowedSucceeded(bookLoan, SuccessMessage.returnBorrowedSucceeded));
  } catch (error) {
    yield* handleApiError(error, bookLoanAction.returnBorrowedFailed, ApiErrorPrefix.returnBorrowed);
  }
}

function* startDeleteBookLoanSaga({ payload: id }: ReturnType<typeof bookLoanAction.startDeleteBookLoan>) {
  try {
    const bookLoan = yield* callTyped(apiBorrowed.delete, id);
    yield put(bookLoanAction.deleteBookLoanSucceeded(bookLoan.data, SuccessMessage.deleteBookRequestSucceeded));
  } catch (error) {
    yield handleApiError(error, bookLoanAction.deleteBookLoanFailed, ApiErrorPrefix.deleteBorrowed);
  }
}

function* refreshSaga() {
  yield all([
    put(bookLoanAction.startReadAllBookLoans()),
    put(bookLoanAction.startReadAllBorrowed()),
  ]);
}

export const refreshBookLoan: RefreshData = {
  actions: [
    BookLoanActionName.CREATE_BOOK_LOAN_SUCCEEDED,
    BookLoanActionName.UPDATE_BOOK_LOAN_SUCCEEDED,
    BookLoanActionName.RETURN_BORROWED_SUCCEEDED,
    BookLoanActionName.DELETE_BOOK_LOAN_SUCCEEDED,
  ],
  saga: refreshSaga,
};

export function* bookLoanSaga() {
  yield all([
    takeEvery(BookLoanActionName.START_READ_ALL_BOOK_LOANS, startReadAllBookLoansSaga),
    takeEvery(BookLoanActionName.START_READ_ALL_BORROWED, startReadAllBorrowedSaga),

    takeEvery(BookLoanActionName.START_CREATE_BOOK_LOAN, startCreateBookLoanSaga),
    takeEvery(BookLoanActionName.START_UPDATE_BOOK_LOAN, startUpdateBookLoanSaga),
    takeEvery(BookLoanActionName.START_RETURN_BORROWED, startReturnBorrowedSaga),
    takeEvery(BookLoanActionName.START_DELETE_BOOK_LOAN, startDeleteBookLoanSaga),
  ]);
}
