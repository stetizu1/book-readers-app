import { ActionType, createAction } from 'typesafe-actions';

import {
  BookRequest,
  BookRequestUpdate,
  BookRequestWithBookData,
} from 'book-app-shared/types/BookRequest';

import { WishlistActionName } from 'app/constants/action-names/wishlist';
import { withIdAndData, withSuccessMessage } from 'app/helpers/action/wrapPayload';
import { DataForBookRequestCreate } from './types/DataForBookRequestCreate';


export const wishlistAction = {
  startGetWishlist: createAction(WishlistActionName.START_GET_WISHLIST)(),
  getWishlistSucceeded: createAction(WishlistActionName.GET_WISHLIST_SUCCEEDED)<BookRequestWithBookData[]>(),
  getWishlistFailed: createAction(WishlistActionName.GET_WISHLIST_FAILED)<string>(),

  startGetAllBookedBookRequests: createAction(WishlistActionName.START_GET_ALL_BOOKED_BOOK_REQUESTS)(),
  getAllBookedBookRequestsSucceeded: createAction(WishlistActionName.GET_ALL_BOOKED_BOOK_REQUESTS_SUCCEEDED)<BookRequestWithBookData[]>(),
  getAllBookedBookRequestsFailed: createAction(WishlistActionName.GET_ALL_BOOKED_BOOK_REQUESTS_FAILED)<string>(),

  startCreateBookRequest: createAction(WishlistActionName.START_CREATE_BOOK_REQUEST)<DataForBookRequestCreate>(),
  createBookRequestSucceeded: createAction(WishlistActionName.CREATE_BOOK_REQUEST_SUCCEEDED, withSuccessMessage<BookRequest>())(),
  createBookRequestFailed: createAction(WishlistActionName.CREATE_BOOK_REQUEST_FAILED)<string>(),

  startUpdateBookRequest: createAction(WishlistActionName.START_UPDATE_BOOK_REQUEST, withIdAndData<BookRequestUpdate>())(),
  updateBookRequestSucceeded: createAction(WishlistActionName.UPDATE_BOOK_REQUEST_SUCCEEDED, withSuccessMessage<BookRequest>())(),
  updateBookRequestFailed: createAction(WishlistActionName.UPDATE_BOOK_REQUEST_FAILED)<string>(),

  startDeleteBookRequest: createAction(WishlistActionName.START_DELETE_BOOK_REQUEST)<number>(),
  deleteBookRequestSucceeded: createAction(WishlistActionName.DELETE_BOOK_REQUEST_SUCCEEDED, withSuccessMessage<BookRequest>())(),
  deleteBookRequestFailed: createAction(WishlistActionName.DELETE_BOOK_REQUEST_FAILED)<string>(),
};

export type WishlistAction = ActionType<typeof wishlistAction>;
