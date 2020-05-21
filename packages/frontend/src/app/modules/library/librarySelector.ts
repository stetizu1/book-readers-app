import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';
import { sortByInnerNumber } from 'app/helpers/sort/sortByInnerNumber';
import { LibraryState } from 'app/modules/library/libraryReducer';

import { getIdMap, getIdMapOptional } from 'app/helpers/getIdMap';
import { bookLoanSelector } from '../book-loan/bookLoanSelector';


const getLibraryState = (state: AppState): LibraryState => state.libraryState;

const getAllAuthorsStatus = createSelector(getLibraryState, (libraryState) => libraryState.authors);
const getAllAuthors = createSelector(getAllAuthorsStatus, (authorsStatus) => getData(authorsStatus));
const getAllAuthorsMap = createSelector(getAllAuthors, (authors) => getIdMap('id', authors));

const getAllBooksStatus = createSelector(getLibraryState, (libraryState) => libraryState.books);
const getAllBooks = createSelector(getAllBooksStatus, (booksStatus) => getData(booksStatus));
const getAllBooksMap = createSelector(getAllBooks, (books) => getIdMap('id', books));

const getAllGenresStatus = createSelector(getLibraryState, (libraryState) => libraryState.genres);
const getAllGenres = createSelector(getAllGenresStatus, (genresStatus) => getData(genresStatus));
const getAllGenresMap = createSelector(getAllGenres, (genres) => getIdMap('id', genres));

const getAllLabelsStatus = createSelector(getLibraryState, (libraryState) => libraryState.loggedUserLabels);
const getAllLabels = createSelector(getAllLabelsStatus, (labelsStatus) => getData(labelsStatus));
const getAllLabelsMap = createSelector(getAllLabels, (labels) => getIdMap('id', labels));

const getAllReviewsStatus = createSelector(getLibraryState, (libraryState) => libraryState.loggedUserReviews);
const getAllReviews = createSelector(getAllReviewsStatus, (reviewsStatus) => getData(reviewsStatus));
const getAllReviewsMap = createSelector(getAllReviews, (reviews) => getIdMapOptional('bookDataId', reviews));

const getAllPersonalBookDataStatus = createSelector(getLibraryState, (libraryState) => libraryState.loggedUserPersonalBookData);
const getAllPersonalBookData = createSelector(getAllPersonalBookDataStatus, (personalBookDataStatus) => getData(personalBookDataStatus));
const getAllPersonalBookDataMap = createSelector(getAllPersonalBookData, (personalBookData) => getIdMapOptional('bookDataId', personalBookData));

const getAllBookDataStatus = createSelector(getLibraryState, (libraryState) => libraryState.loggedUserBookData);
const getAllBookData = createSelector(getAllBookDataStatus, (bookDataStatus) => getData(bookDataStatus));
const getAllBookDataMap = createSelector(getAllBookData, (bookData) => getIdMap('id', bookData));


const getLastSearchedBookDataId = createSelector(getLibraryState, (libraryState) => libraryState.lastSearchId);
const getSearchedBookDataStatus = createSelector(getLibraryState, (libraryState) => libraryState.foundBookData);
const getSearchedBookData = createSelector(getSearchedBookDataStatus, (currentBookDataStatus) => getData(currentBookDataStatus));

const getBookDataCount = createSelector(getAllBookData, (bookData) => bookData?.length);
const getReviewsCount = createSelector(getAllReviews, (reviews) => reviews?.length);

const getAllNotBorrowedBookData = createSelector([getAllBookData, bookLoanSelector.getAllActiveBookLoans], (bookData, loans) => (
  bookData?.filter((data) => loans?.every((loan) => loan.bookDataId !== data.id))));

const getAllBookDataSorted = createSelector(getAllBookData, (bookData) => bookData?.sort(sortByInnerNumber('id')));
const getAllLabelsSorted = createSelector(getAllLabels, (labels) => labels?.sort(sortByInnerNumber('id')));


export const librarySelector = {
  getAllAuthorsStatus,
  getAllBooksStatus,
  getAllGenresStatus,
  getAllLabelsStatus,
  getAllReviewsStatus,
  getAllPersonalBookDataStatus,
  getAllBookDataStatus,
  getSearchedBookDataStatus,

  getLastSearchedBookDataId,
  getSearchedBookData,
  getAllGenres,
  getAllLabels,
  getAllReviews,

  getAllAuthorsMap,
  getAllBooksMap,
  getAllGenresMap,
  getAllLabelsMap,
  getAllBookData,
  getAllBookDataMap,
  getAllReviewsMap,
  getAllPersonalBookDataMap,

  getBookDataCount,
  getReviewsCount,

  getAllNotBorrowedBookData,
  getAllBookDataSorted,
  getAllLabelsSorted,
};
