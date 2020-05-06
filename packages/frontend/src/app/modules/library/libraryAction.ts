import { ActionType, createAction } from 'typesafe-actions';

import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Genre } from 'book-app-shared/types/Genre';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { LibraryActionName } from 'app/constants/actionNames/library';


export const libraryAction = {
  startGetAllAuthors: createAction(LibraryActionName.START_GET_ALL_AUTHORS)(),
  getAllAuthorsSucceeded: createAction(LibraryActionName.GET_ALL_AUTHORS_SUCCEEDED)<Author[]>(),
  getAllAuthorsFailed: createAction(LibraryActionName.GET_ALL_AUTHORS_FAILED)<string>(),

  startGetAllBooks: createAction(LibraryActionName.START_GET_ALL_BOOKS)(),
  getAllBooksSucceeded: createAction(LibraryActionName.GET_ALL_BOOKS_SUCCEEDED)<BookWithAuthorIds[]>(),
  getAllBooksFailed: createAction(LibraryActionName.GET_ALL_BOOKS_FAILED)<string>(),

  startGetAllBookData: createAction(LibraryActionName.START_GET_ALL_BOOK_DATA)(),
  getAllBookDataSucceeded: createAction(LibraryActionName.GET_ALL_BOOK_DATA_SUCCEEDED)<BookDataWithLabelIds[]>(),
  getAllBookDataFailed: createAction(LibraryActionName.GET_ALL_BOOK_DATA_FAILED)<string>(),

  startGetAllLabels: createAction(LibraryActionName.START_GET_ALL_LABELS)(),
  getAllLabelsSucceeded: createAction(LibraryActionName.GET_ALL_LABELS_SUCCEEDED)<Label[]>(),
  getAllLabelsFailed: createAction(LibraryActionName.GET_ALL_LABELS_FAILED)<string>(),

  startGetAllGenres: createAction(LibraryActionName.START_GET_ALL_GENRES)(),
  getAllGenresSucceeded: createAction(LibraryActionName.GET_ALL_GENRES_SUCCEEDED)<Genre[]>(),
  getAllGenresFailed: createAction(LibraryActionName.GET_ALL_GENRES_FAILED)<string>(),

  startGetAllReviews: createAction(LibraryActionName.START_GET_ALL_REVIEWS)(),
  getAllReviewsSucceeded: createAction(LibraryActionName.GET_ALL_REVIEWS_SUCCEEDED)<Review[]>(),
  getAllReviewsFailed: createAction(LibraryActionName.GET_ALL_REVIEWS_FAILED)<string>(),

  startGetAllPersonalBookData: createAction(LibraryActionName.START_GET_ALL_PERSONAL_BOOK_DATA)(),
  getAllPersonalBookDataSucceeded: createAction(LibraryActionName.GET_ALL_PERSONAL_BOOK_DATA_SUCCEEDED)<PersonalBookData[]>(),
  getAllPersonalBookDataFailed: createAction(LibraryActionName.GET_ALL_PERSONAL_BOOK_DATA_FAILED)<string>(),
};

export type LibraryAction = ActionType<typeof libraryAction>;
