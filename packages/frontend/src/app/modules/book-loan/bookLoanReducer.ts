import { Reducer } from 'redux';

import { Borrowed } from 'book-app-shared/types/Borrowed';

import { BookLoanActionName } from 'app/constants/action-names/bookLoan';
import { getStatus, Status } from 'app/constants/Status';

import { BookLoanAction } from './bookLoanAction';


export interface BookLoanState {
  bookLoans: Status<Borrowed[]>;
  borrowed: Status<Borrowed[]>;
}

const initialState: BookLoanState = {
  bookLoans: getStatus.idle(),
  borrowed: getStatus.idle(),
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
      return reducer.setBookLoans(state, getStatus.loading());
    case BookLoanActionName.READ_ALL_BOOK_LOANS_SUCCEEDED:
      return reducer.setBookLoans(state, getStatus.success(action.payload));
    case BookLoanActionName.READ_ALL_BOOK_LOANS_FAILED:
      return reducer.setBookLoans(state, getStatus.failure(action.payload));

    case BookLoanActionName.START_READ_ALL_BORROWED:
      return reducer.setBorrowed(state, getStatus.loading());
    case BookLoanActionName.READ_ALL_BORROWED_SUCCEEDED:
      return reducer.setBorrowed(state, getStatus.success(action.payload));
    case BookLoanActionName.READ_ALL_BORROWED_FAILED:
      return reducer.setBorrowed(state, getStatus.failure(action.payload));

    default:
      return state;
  }
};
