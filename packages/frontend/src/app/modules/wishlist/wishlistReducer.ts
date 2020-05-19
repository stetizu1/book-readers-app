import { Reducer } from 'redux';

import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';

import { getStatus, Status } from 'app/constants/Status';
import { WishlistActionName } from 'app/constants/action-names/wishlist';

import { WishlistAction } from './wishlistAction';


export interface WishlistState {
  wishlist: Status<BookRequestWithBookData[]>;
  bookedBookRequests: Status<BookRequestWithBookData[]>;
}

const initialState: WishlistState = {
  wishlist: getStatus.idle(),
  bookedBookRequests: getStatus.idle(),
};

const reducer = {
  setWishlist: (state: WishlistState, wishlist: Status<BookRequestWithBookData[]>): WishlistState => ({
    ...state,
    wishlist,
  }),
  setBookedBookRequests: (state: WishlistState, bookedBookRequests: Status<BookRequestWithBookData[]>): WishlistState => ({
    ...state,
    bookedBookRequests,
  }),
};


export const wishlistReducer: Reducer<WishlistState, WishlistAction> = (state = initialState, action) => {
  switch (action.type) {
    case WishlistActionName.START_READ_WISHLIST:
      return reducer.setWishlist(state, getStatus.loading());
    case WishlistActionName.READ_WISHLIST_SUCCEEDED:
      return reducer.setWishlist(state, getStatus.success(action.payload));
    case WishlistActionName.READ_WISHLIST_FAILED:
      return reducer.setWishlist(state, getStatus.failure());

    case WishlistActionName.START_READ_ALL_BOOKED_BOOK_REQUESTS:
      return reducer.setBookedBookRequests(state, getStatus.loading());
    case WishlistActionName.READ_ALL_BOOKED_BOOK_REQUESTS_SUCCEEDED:
      return reducer.setBookedBookRequests(state, getStatus.success(action.payload));
    case WishlistActionName.READ_ALL_BOOKED_BOOK_REQUESTS_FAILED:
      return reducer.setBookedBookRequests(state, getStatus.failure());
    default:
      return state;
  }
};
