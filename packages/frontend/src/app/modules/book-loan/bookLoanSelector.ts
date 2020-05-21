import { createSelector } from 'reselect';

import { Borrowed } from 'book-app-shared/types/Borrowed';

import { getData } from 'app/constants/Status';

import { AppState } from 'app/types/AppState';

import { getIdMap } from 'app/helpers/getIdMap';
import { sortByInnerDate } from 'app/helpers/sort/sortByInnerDate';

import { BookLoanState } from './bookLoanReducer';


const getBookLoanState = (state: AppState): BookLoanState => state.bookLoanState;

const getAllBookLoansStatus = createSelector(getBookLoanState, (bookLoanState) => bookLoanState.bookLoans);
const getAllBookLoans = createSelector(getAllBookLoansStatus, (bookLoanStatus) => getData(bookLoanStatus));
const getAllActiveBookLoans = createSelector(getAllBookLoans, (bookLoans) => bookLoans?.filter((bookLoan) => !bookLoan.returned));
const getAllActiveBookLoansMap = createSelector(getAllActiveBookLoans, (bookLoans) => getIdMap('id', bookLoans));

const getAllBorrowedStatus = createSelector(getBookLoanState, (bookLoanState) => bookLoanState.borrowed);
const getAllBorrowed = createSelector(getAllBorrowedStatus, (borrowedStatus) => getData(borrowedStatus));
const getAllActiveBorrowed = createSelector(getAllBorrowed, (allBorrowed) => allBorrowed?.filter((borrowed) => !borrowed.returned));
const getAllActiveBorrowedMap = createSelector(getAllActiveBorrowed, (borrowed) => getIdMap('id', borrowed));

const getAllActiveBorrowedSorted = createSelector(getAllActiveBorrowed, (borrowed) => borrowed?.sort(sortByInnerDate<Borrowed>('until')));
const getBorrowedCount = createSelector(getAllActiveBorrowed, (borrowed) => borrowed?.length);
const getBookLoanedCount = createSelector(getAllActiveBookLoans, (loans) => loans?.length);

const getAllActiveBookLoansSorted = createSelector(getAllActiveBookLoans, (bookLoans) => bookLoans?.sort(sortByInnerDate<Borrowed>('until')));

export const bookLoanSelector = {
  getAllBookLoansStatus,
  getAllBorrowedStatus,

  getAllActiveBookLoans,
  getAllActiveBookLoansMap,
  getAllActiveBorrowed,
  getAllActiveBorrowedMap,

  getBorrowedCount,
  getBookLoanedCount,

  getAllActiveBorrowedSorted,
  getAllActiveBookLoansSorted,
};
