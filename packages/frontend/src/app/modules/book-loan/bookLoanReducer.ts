import { Reducer } from 'redux';

import { Borrowed } from 'book-app-shared/types/Borrowed';

import { BookLoanActionName } from 'app/constants/action-names/bookLoan';
import { createStatus, Status } from 'app/constants/Status';

import { BookLoanAction } from './bookLoanAction';


export interface BookLoanState {
  bookLoans: Status<Borrowed[]>;
  borrowed: Status<Borrowed[]>;
}

const initialState: BookLoanState = {
  bookLoans: createStatus.idle(),
  borrowed: createStatus.idle(),
};

const reducer = {
  setBookLoans: (state: BookLoanState, bookLoans: Status<Borrowed[]>): BookLoanState => ({
    ...state,
    bookLoans,
  }),
  setBorrowed: (state: BookLoanState, borrowed: Status<Borrowed[]>): BookLoanState => ({
    ...state,
    borrowed,
  }),
};


export const bookLoanReducer: Reducer<BookLoanState, BookLoanAction> = (state = initialState, action) => {
  switch (action.type) {
    case BookLoanActionName.START_READ_ALL_BOOK_LOANS:
      return reducer.setBookLoans(state, createStatus.loading());
    case BookLoanActionName.READ_ALL_BOOK_LOANS_SUCCEEDED:
      return reducer.setBookLoans(state, createStatus.success(action.payload));
    case BookLoanActionName.READ_ALL_BOOK_LOANS_FAILED:
      return reducer.setBookLoans(state, createStatus.failure());

    case BookLoanActionName.START_READ_ALL_BORROWED:
      return reducer.setBorrowed(state, createStatus.loading());
    case BookLoanActionName.READ_ALL_BORROWED_SUCCEEDED:
      return reducer.setBorrowed(state, createStatus.success(action.payload));
    case BookLoanActionName.READ_ALL_BORROWED_FAILED:
      return reducer.setBorrowed(state, createStatus.failure());

    default:
      return state;
  }
};
