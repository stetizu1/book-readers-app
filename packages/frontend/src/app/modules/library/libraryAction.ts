import { ActionType, createAction } from 'typesafe-actions';

import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { Label, LabelCreate, LabelUpdate } from 'book-app-shared/types/Label';
import { Genre } from 'book-app-shared/types/Genre';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { LibraryActionName } from 'app/constants/action-names/library';
import { dataAndId, dataAndSuccessMessage } from 'app/helpers/action/wrapPayload';
import { DataForBookDataUpdate } from 'app/modules/library/types/DataForBookDataUpdate';
import { DataForBookDataCreate } from './types/DataForBookDataCreate';


export const libraryAction = {
  startReadAllAuthors: createAction(LibraryActionName.START_READ_ALL_AUTHORS)(),
  readAllAuthorsSucceeded: createAction(LibraryActionName.READ_ALL_AUTHORS_SUCCEEDED)<Author[]>(),
  readAllAuthorsFailed: createAction(LibraryActionName.READ_ALL_AUTHORS_FAILED)<string>(),

  startReadAllBooks: createAction(LibraryActionName.START_READ_ALL_BOOKS)(),
  readAllBooksSucceeded: createAction(LibraryActionName.READ_ALL_BOOKS_SUCCEEDED)<BookWithAuthorIds[]>(),
  readAllBooksFailed: createAction(LibraryActionName.READ_ALL_BOOKS_FAILED)<string>(),

  startReadAllBookData: createAction(LibraryActionName.START_READ_ALL_BOOK_DATA)(),
  readAllBookDataSucceeded: createAction(LibraryActionName.READ_ALL_BOOK_DATA_SUCCEEDED)<BookDataWithLabelIds[]>(),
  readAllBookDataFailed: createAction(LibraryActionName.READ_ALL_BOOK_DATA_FAILED)<string>(),

  startReadAllLabels: createAction(LibraryActionName.START_READ_ALL_LABELS)(),
  readAllLabelsSucceeded: createAction(LibraryActionName.READ_ALL_LABELS_SUCCEEDED)<Label[]>(),
  readAllLabelsFailed: createAction(LibraryActionName.READ_ALL_LABELS_FAILED)<string>(),

  startReadAllGenres: createAction(LibraryActionName.START_READ_ALL_GENRES)(),
  readAllGenresSucceeded: createAction(LibraryActionName.READ_ALL_GENRES_SUCCEEDED)<Genre[]>(),
  readAllGenresFailed: createAction(LibraryActionName.READ_ALL_GENRES_FAILED)<string>(),

  startReadAllReviews: createAction(LibraryActionName.START_READ_ALL_REVIEWS)(),
  readAllReviewsSucceeded: createAction(LibraryActionName.READ_ALL_REVIEWS_SUCCEEDED)<Review[]>(),
  readAllReviewsFailed: createAction(LibraryActionName.READ_ALL_REVIEWS_FAILED)<string>(),

  startReadAllPersonalBookData: createAction(LibraryActionName.START_READ_ALL_PERSONAL_BOOK_DATA)(),
  readAllPersonalBookDataSucceeded: createAction(LibraryActionName.READ_ALL_PERSONAL_BOOK_DATA_SUCCEEDED)<PersonalBookData[]>(),
  readAllPersonalBookDataFailed: createAction(LibraryActionName.READ_ALL_PERSONAL_BOOK_DATA_FAILED)<string>(),

  startCreateBookData: createAction(LibraryActionName.START_CREATE_BOOK_DATA)<DataForBookDataCreate>(),
  createBookDataSucceeded: createAction(LibraryActionName.CREATE_BOOK_DATA_SUCCEEDED, dataAndSuccessMessage<BookData>())(),
  createBookDataFailed: createAction(LibraryActionName.CREATE_BOOK_DATA_FAILED)<string>(),

  startUpdateBookData: createAction(LibraryActionName.START_UPDATE_BOOK_DATA, dataAndId<DataForBookDataUpdate>())(),
  updateBookDataSucceeded: createAction(LibraryActionName.UPDATE_BOOK_DATA_SUCCEEDED, dataAndSuccessMessage<BookData>())(),
  updateBookDataFailed: createAction(LibraryActionName.UPDATE_BOOK_DATA_FAILED)<string>(),

  startDeleteBookData: createAction(LibraryActionName.START_DELETE_BOOK_DATA)<number>(),
  deleteBookDataSucceeded: createAction(LibraryActionName.DELETE_BOOK_DATA_SUCCEEDED, dataAndSuccessMessage<BookData>())(),
  deleteBookDataFailed: createAction(LibraryActionName.DELETE_BOOK_DATA_FAILED)<string>(),


  startCreateLabel: createAction(LibraryActionName.START_CREATE_LABEL)<LabelCreate>(),
  createLabelSucceeded: createAction(LibraryActionName.CREATE_LABEL_SUCCEEDED, dataAndSuccessMessage<Label>())(),
  createLabelFailed: createAction(LibraryActionName.CREATE_LABEL_FAILED)<string>(),

  startUpdateLabel: createAction(LibraryActionName.START_UPDATE_LABEL, dataAndId<LabelUpdate>())(),
  updateLabelSucceeded: createAction(LibraryActionName.UPDATE_LABEL_SUCCEEDED, dataAndSuccessMessage<Label>())(),
  updateLabelFailed: createAction(LibraryActionName.UPDATE_LABEL_FAILED)<string>(),

  startDeleteLabel: createAction(LibraryActionName.START_DELETE_LABEL)<number>(),
  deleteLabelSucceeded: createAction(LibraryActionName.DELETE_LABEL_SUCCEEDED, dataAndSuccessMessage<Label>())(),
  deleteLabelFailed: createAction(LibraryActionName.DELETE_LABEL_FAILED)<string>(),
};

export type LibraryAction = ActionType<typeof libraryAction>;
