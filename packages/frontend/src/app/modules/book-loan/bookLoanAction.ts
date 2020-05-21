import { ActionType, createAction } from 'typesafe-actions';

import { Borrowed, BorrowedCreate, BorrowedUpdate } from 'book-app-shared/types/Borrowed';

import { BookLoanActionName } from 'app/constants/action-names/bookLoan';
import { dataAndId, dataAndSuccessMessage } from 'app/helpers/action/wrapPayload';


export const bookLoanAction = {
  startReadAllBookLoans: createAction(BookLoanActionName.START_READ_ALL_BOOK_LOANS)(),
  readAllBookLoansSucceeded: createAction(BookLoanActionName.READ_ALL_BOOK_LOANS_SUCCEEDED)<Borrowed[]>(),
  readAllBookLoansFailed: createAction(BookLoanActionName.READ_ALL_BOOK_LOANS_FAILED)<string>(),

  startReadAllBorrowed: createAction(BookLoanActionName.START_READ_ALL_BORROWED)(),
  readAllBorrowedSucceeded: createAction(BookLoanActionName.READ_ALL_BORROWED_SUCCEEDED)<Borrowed[]>(),
  readAllBorrowedFailed: createAction(BookLoanActionName.READ_ALL_BORROWED_FAILED)<string>(),

  startCreateBookLoan: createAction(BookLoanActionName.START_CREATE_BOOK_LOAN)<BorrowedCreate>(),
  createBookLoanSucceeded: createAction(BookLoanActionName.CREATE_BOOK_LOAN_SUCCEEDED, dataAndSuccessMessage<Borrowed>())(),
  createBookLoanFailed: createAction(BookLoanActionName.CREATE_BOOK_LOAN_FAILED)<string>(),

  startUpdateBookLoan: createAction(BookLoanActionName.START_UPDATE_BOOK_LOAN, dataAndId<BorrowedUpdate>())(),
  updateBookLoanSucceeded: createAction(BookLoanActionName.UPDATE_BOOK_LOAN_SUCCEEDED, dataAndSuccessMessage<Borrowed>())(),
  updateBookLoanFailed: createAction(BookLoanActionName.UPDATE_BOOK_LOAN_FAILED)<string>(),

  startReturnBorrowed: createAction(BookLoanActionName.START_RETURN_BORROWED)<number>(),
  returnBorrowedSucceeded: createAction(BookLoanActionName.RETURN_BORROWED_SUCCEEDED, dataAndSuccessMessage<Borrowed>())(),
  returnBorrowedFailed: createAction(BookLoanActionName.RETURN_BORROWED_FAILED)<string>(),

  startDeleteBookLoan: createAction(BookLoanActionName.START_DELETE_BOOK_LOAN)<number>(),
  deleteBookLoanSucceeded: createAction(BookLoanActionName.DELETE_BOOK_LOAN_SUCCEEDED, dataAndSuccessMessage<Borrowed>())(),
  deleteBookLoanFailed: createAction(BookLoanActionName.DELETE_BOOK_LOAN_FAILED)<string>(),
};

export type BookLoanAction = ActionType<typeof bookLoanAction>;
