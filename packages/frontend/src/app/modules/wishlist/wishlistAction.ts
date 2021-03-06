import { ActionType, createAction } from 'typesafe-actions';

import { BookRequest, BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { BookData } from 'book-app-shared/types/BookData';

import { WishlistActionName } from 'app/constants/action-names/wishlist';
import { dataAndId, dataAndSuccessMessage } from 'app/helpers/action/wrapPayload';
import { DataForBookRequestCreate } from './types/DataForBookRequestCreate';
import { DataForBookRequestUpdate } from './types/DataForBookRequestUpdate';


export const wishlistAction = {
  startReadWishlist: createAction(WishlistActionName.START_READ_WISHLIST)(),
  readWishlistSucceeded: createAction(WishlistActionName.READ_WISHLIST_SUCCEEDED)<BookRequestWithBookData[]>(),
  readWishlistFailed: createAction(WishlistActionName.READ_WISHLIST_FAILED)<string>(),

  startReadAllBookedBookRequests: createAction(WishlistActionName.START_READ_ALL_BOOKED_BOOK_REQUESTS)(),
  readAllBookedBookRequestsSucceeded: createAction(WishlistActionName.READ_ALL_BOOKED_BOOK_REQUESTS_SUCCEEDED)<BookRequestWithBookData[]>(),
  readAllBookedBookRequestsFailed: createAction(WishlistActionName.READ_ALL_BOOKED_BOOK_REQUESTS_FAILED)<string>(),

  startCreateBookRequest: createAction(WishlistActionName.START_CREATE_BOOK_REQUEST)<DataForBookRequestCreate>(),
  createBookRequestSucceeded: createAction(WishlistActionName.CREATE_BOOK_REQUEST_SUCCEEDED, dataAndSuccessMessage<BookRequest>())(),
  createBookRequestFailed: createAction(WishlistActionName.CREATE_BOOK_REQUEST_FAILED)<string>(),

  startUpdateBookRequest: createAction(WishlistActionName.START_UPDATE_BOOK_REQUEST, dataAndId<DataForBookRequestUpdate>())(),
  updateBookRequestSucceeded: createAction(WishlistActionName.UPDATE_BOOK_REQUEST_SUCCEEDED, dataAndSuccessMessage<BookRequest>())(),
  updateBookRequestFailed: createAction(WishlistActionName.UPDATE_BOOK_REQUEST_FAILED)<string>(),

  startBookBookRequest: createAction(WishlistActionName.START_BOOK_BOOK_REQUEST, dataAndId<number | null>())(),
  bookBookRequestSucceeded: createAction(WishlistActionName.BOOK_BOOK_REQUEST_SUCCEEDED, dataAndSuccessMessage<BookRequest>())(),
  bookBookRequestFailed: createAction(WishlistActionName.BOOK_BOOK_REQUEST_FAILED)<string>(),

  startDeleteBookRequest: createAction(WishlistActionName.START_DELETE_BOOK_REQUEST)<number>(),
  deleteBookRequestSucceeded: createAction(WishlistActionName.DELETE_BOOK_REQUEST_SUCCEEDED, dataAndSuccessMessage<BookRequest>())(),
  deleteBookRequestFailed: createAction(WishlistActionName.DELETE_BOOK_REQUEST_FAILED)<string>(),

  startMoveBookToLibrary: createAction(WishlistActionName.START_MOVE_BOOK_TO_LIBRARY, dataAndId<number>())(), // number is userId
  moveBookToLibrarySucceeded: createAction(WishlistActionName.MOVE_BOOK_TO_LIBRARY_SUCCEEDED, dataAndSuccessMessage<BookData>())(),
  moveBookToLibraryFailed: createAction(WishlistActionName.MOVE_BOOK_TO_LIBRARY_FAILED)<string>(),
};

export type WishlistAction = ActionType<typeof wishlistAction>;
