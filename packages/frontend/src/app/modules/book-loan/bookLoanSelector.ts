import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';

import { BookLoanState } from './bookLoanReducer';

const getBookLoanState = (state: AppState): BookLoanState => state.bookLoanState;

const getAllBookLoansStatus = createSelector(getBookLoanState, (bookLoanState) => bookLoanState.bookLoans);
const getAllBookLoans = createSelector(getAllBookLoansStatus, (bookLoanStatus) => getData(bookLoanStatus));
const getAllActiveBookLoans = createSelector(getAllBookLoans, (bookLoans) => bookLoans?.filter((bookLoan) => !bookLoan.returned));

const getAllBorrowedStatus = createSelector(getBookLoanState, (bookLoanState) => bookLoanState.borrowed);
const getAllBorrowed = createSelector(getAllBorrowedStatus, (borrowedStatus) => getData(borrowedStatus));
const getAllActiveBorrowed = createSelector(getAllBorrowed, (allBorrowed) => allBorrowed?.filter((borrowed) => !borrowed.returned));

export const bookLoanSelector = {
  getAllActiveBookLoans,
  getAllActiveBorrowed,
};
