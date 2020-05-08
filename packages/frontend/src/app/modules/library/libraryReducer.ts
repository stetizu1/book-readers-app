import { Reducer } from 'redux';

import { BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { Label } from 'book-app-shared/types/Label';
import { Genre } from 'book-app-shared/types/Genre';


import { getStatus, Status } from 'app/constants/Status';
import { LibraryActionName } from 'app/constants/actionNames/library';

import { LibraryAction } from 'app/modules/library/libraryAction';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { Review } from 'book-app-shared/types/Review';


export interface LibraryState {
  authors: Status<Author[]>;
  books: Status<BookWithAuthorIds[]>;
  genres: Status<Genre[]>;
  loggedUserBookData: Status<BookDataWithLabelIds[]>;
  loggedUserLabels: Status<Label[]>;
  loggedUserReviews: Status<Review[]>;
  loggedUserPersonalBookData: Status<PersonalBookData[]>;
}

const initialState: LibraryState = {
  authors: getStatus.idle(),
  books: getStatus.idle(),
  genres: getStatus.idle(),
  loggedUserBookData: getStatus.idle(),
  loggedUserLabels: getStatus.idle(),
  loggedUserReviews: getStatus.idle(),
  loggedUserPersonalBookData: getStatus.idle(),
};

const reducer = {
  setAuthors: (state: LibraryState, authors: Status<Author[]>): LibraryState => ({
    ...state,
    authors,
  }),
  setBooks: (state: LibraryState, books: Status<BookWithAuthorIds[]>): LibraryState => ({
    ...state,
    books,
  }),
  setGenres: (state: LibraryState, genres: Status<Genre[]>): LibraryState => ({
    ...state,
    genres,
  }),
  setLoggedUserBookData: (state: LibraryState, loggedUserBookData: Status<BookDataWithLabelIds[]>): LibraryState => ({
    ...state,
    loggedUserBookData,
  }),
  setLoggedUserLabels: (state: LibraryState, loggedUserLabels: Status<Label[]>): LibraryState => ({
    ...state,
    loggedUserLabels,
  }),
  setLoggedUserReviews: (state: LibraryState, loggedUserReviews: Status<Review[]>): LibraryState => ({
    ...state,
    loggedUserReviews,
  }),
  setLoggedUserPersonalBookData: (state: LibraryState, loggedUserPersonalBookData: Status<PersonalBookData[]>): LibraryState => ({
    ...state,
    loggedUserPersonalBookData,
  }),
};


export const libraryReducer: Reducer<LibraryState, LibraryAction> = (state = initialState, action) => {
  switch (action.type) {
    case LibraryActionName.START_GET_ALL_AUTHORS:
      return reducer.setAuthors(state, getStatus.loading());
    case LibraryActionName.GET_ALL_AUTHORS_FAILED:
      return reducer.setAuthors(state, getStatus.failure(action.payload));
    case LibraryActionName.GET_ALL_AUTHORS_SUCCEEDED:
      return reducer.setAuthors(state, getStatus.success(action.payload));


    case LibraryActionName.START_GET_ALL_BOOKS:
      return reducer.setBooks(state, getStatus.loading());
    case LibraryActionName.GET_ALL_BOOKS_FAILED:
      return reducer.setBooks(state, getStatus.failure(action.payload));
    case LibraryActionName.GET_ALL_BOOKS_SUCCEEDED:
      return reducer.setBooks(state, getStatus.success(action.payload));


    case LibraryActionName.START_GET_ALL_GENRES:
      return reducer.setGenres(state, getStatus.loading());
    case LibraryActionName.GET_ALL_GENRES_FAILED:
      return reducer.setGenres(state, getStatus.failure(action.payload));
    case LibraryActionName.GET_ALL_GENRES_SUCCEEDED:
      return reducer.setGenres(state, getStatus.success(action.payload));


    case LibraryActionName.START_GET_ALL_BOOK_DATA:
      return reducer.setLoggedUserBookData(state, getStatus.loading());
    case LibraryActionName.GET_ALL_BOOK_DATA_FAILED:
      return reducer.setLoggedUserBookData(state, getStatus.failure(action.payload));
    case LibraryActionName.GET_ALL_BOOK_DATA_SUCCEEDED:
      return reducer.setLoggedUserBookData(state, getStatus.success(action.payload));


    case LibraryActionName.START_GET_ALL_LABELS:
      return reducer.setLoggedUserLabels(state, getStatus.loading());
    case LibraryActionName.GET_ALL_LABELS_FAILED:
      return reducer.setLoggedUserLabels(state, getStatus.failure(action.payload));
    case LibraryActionName.GET_ALL_LABELS_SUCCEEDED:
      return reducer.setLoggedUserLabels(state, getStatus.success(action.payload));

    case LibraryActionName.START_GET_ALL_REVIEWS:
      return reducer.setLoggedUserReviews(state, getStatus.loading());
    case LibraryActionName.GET_ALL_REVIEWS_FAILED:
      return reducer.setLoggedUserReviews(state, getStatus.failure(action.payload));
    case LibraryActionName.GET_ALL_REVIEWS_SUCCEEDED:
      return reducer.setLoggedUserReviews(state, getStatus.success(action.payload));

    case LibraryActionName.START_GET_ALL_PERSONAL_BOOK_DATA:
      return reducer.setLoggedUserPersonalBookData(state, getStatus.loading());
    case LibraryActionName.GET_ALL_PERSONAL_BOOK_DATA_FAILED:
      return reducer.setLoggedUserPersonalBookData(state, getStatus.failure(action.payload));
    case LibraryActionName.GET_ALL_PERSONAL_BOOK_DATA_SUCCEEDED:
      return reducer.setLoggedUserPersonalBookData(state, getStatus.success(action.payload));


    default:
      return state;
  }
};