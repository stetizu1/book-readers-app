import { ActionType, createAction } from 'typesafe-actions';

import { Author } from 'book-app-shared/types/Author';
import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Genre } from 'book-app-shared/types/Genre';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { LibraryActionName } from 'app/constants/action-names/library';
import { withIdAndData, withSuccessMessage } from 'app/helpers/action/wrapPayload';
import { CurrentBookData } from 'app/modules/library/types/CurrentBookData';
import { DataForBookDataUpdate } from 'app/modules/library/types/DataForBookDataUpdate';


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

  startGetBookData: createAction(LibraryActionName.START_GET_BOOK_DATA)<number>(),
  getBookDataSucceeded: createAction(LibraryActionName.GET_BOOK_DATA_SUCCEEDED,
    (bookData: BookData, book: Book, authors: Author[], labels: Label[], genre: Genre | null, personalBookData: PersonalBookData | null, review: Review | null) => ({
      bookData,
      book,
      authors,
      labels,
      genre,
      personalBookData,
      review,
    }))<CurrentBookData>(),
  getBookDataFailed: createAction(LibraryActionName.GET_BOOK_DATA_FAILED)<string>(),

  startUpdateBookData: createAction(LibraryActionName.START_UPDATE_BOOK_DATA, withIdAndData<DataForBookDataUpdate>())(),
  updateBookDataSucceeded: createAction(LibraryActionName.UPDATE_BOOK_DATA_SUCCEEDED, withSuccessMessage<BookData>())(),
  updateBookDataFailed: createAction(LibraryActionName.UPDATE_BOOK_DATA_FAILED)<string>(),

  startDeleteBookData: createAction(LibraryActionName.START_DELETE_BOOK_DATA)<number>(),
  deleteBookDataSucceeded: createAction(LibraryActionName.DELETE_BOOK_DATA_SUCCEEDED, withSuccessMessage<BookData>())(),
  deleteBookDataFailed: createAction(LibraryActionName.DELETE_BOOK_DATA_FAILED)<string>(),
};

export type LibraryAction = ActionType<typeof libraryAction>;
