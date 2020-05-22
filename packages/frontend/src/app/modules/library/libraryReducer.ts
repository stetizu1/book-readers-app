import { Reducer } from 'redux';

import { BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { Label } from 'book-app-shared/types/Label';
import { Genre } from 'book-app-shared/types/Genre';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { Review } from 'book-app-shared/types/Review';


import { createStatus, Status } from 'app/constants/Status';
import { LibraryActionName } from 'app/constants/action-names/library';

import { LibraryAction } from 'app/modules/library/libraryAction';


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
  authors: createStatus.idle(),
  books: createStatus.idle(),
  genres: createStatus.idle(),
  loggedUserBookData: createStatus.idle(),
  loggedUserLabels: createStatus.idle(),
  loggedUserReviews: createStatus.idle(),
  loggedUserPersonalBookData: createStatus.idle(),
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
    case LibraryActionName.START_READ_ALL_AUTHORS:
      return reducer.setAuthors(state, createStatus.loading());
    case LibraryActionName.READ_ALL_AUTHORS_SUCCEEDED:
      return reducer.setAuthors(state, createStatus.success(action.payload));
    case LibraryActionName.READ_ALL_AUTHORS_FAILED:
      return reducer.setAuthors(state, createStatus.failure());


    case LibraryActionName.START_READ_ALL_BOOKS:
      return reducer.setBooks(state, createStatus.loading());
    case LibraryActionName.READ_ALL_BOOKS_SUCCEEDED:
      return reducer.setBooks(state, createStatus.success(action.payload));
    case LibraryActionName.READ_ALL_BOOKS_FAILED:
      return reducer.setBooks(state, createStatus.failure());


    case LibraryActionName.START_READ_ALL_GENRES:
      return reducer.setGenres(state, createStatus.loading());
    case LibraryActionName.READ_ALL_GENRES_SUCCEEDED:
      return reducer.setGenres(state, createStatus.success(action.payload));
    case LibraryActionName.READ_ALL_GENRES_FAILED:
      return reducer.setGenres(state, createStatus.failure());


    case LibraryActionName.START_READ_ALL_BOOK_DATA:
      return reducer.setLoggedUserBookData(state, createStatus.loading());
    case LibraryActionName.READ_ALL_BOOK_DATA_SUCCEEDED:
      return reducer.setLoggedUserBookData(state, createStatus.success(action.payload));
    case LibraryActionName.READ_ALL_BOOK_DATA_FAILED:
      return reducer.setLoggedUserBookData(state, createStatus.failure());


    case LibraryActionName.START_READ_ALL_LABELS:
      return reducer.setLoggedUserLabels(state, createStatus.loading());
    case LibraryActionName.READ_ALL_LABELS_SUCCEEDED:
      return reducer.setLoggedUserLabels(state, createStatus.success(action.payload));
    case LibraryActionName.READ_ALL_LABELS_FAILED:
      return reducer.setLoggedUserLabels(state, createStatus.failure());

    case LibraryActionName.START_READ_ALL_REVIEWS:
      return reducer.setLoggedUserReviews(state, createStatus.loading());
    case LibraryActionName.READ_ALL_REVIEWS_SUCCEEDED:
      return reducer.setLoggedUserReviews(state, createStatus.success(action.payload));
    case LibraryActionName.READ_ALL_REVIEWS_FAILED:
      return reducer.setLoggedUserReviews(state, createStatus.failure());

    case LibraryActionName.START_READ_ALL_PERSONAL_BOOK_DATA:
      return reducer.setLoggedUserPersonalBookData(state, createStatus.loading());
    case LibraryActionName.READ_ALL_PERSONAL_BOOK_DATA_SUCCEEDED:
      return reducer.setLoggedUserPersonalBookData(state, createStatus.success(action.payload));
    case LibraryActionName.READ_ALL_PERSONAL_BOOK_DATA_FAILED:
      return reducer.setLoggedUserPersonalBookData(state, createStatus.failure());

    default:
      return state;
  }
};
