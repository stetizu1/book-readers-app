import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';
import { LibraryState } from 'app/modules/library/libraryReducer';

import { getIdMap, getIdMapOptional } from 'app/helpers/getIdMap';


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


export const librarySelector = {
  getAllAuthorsMap,
  getAllBooksMap,
  getAllGenresMap,
  getAllLabelsMap,
  getAllBookData,
  getAllReviewsMap,
  getAllPersonalBookDataMap,
};
