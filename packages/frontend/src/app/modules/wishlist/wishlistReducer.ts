import { Reducer } from 'redux';

import { BookRequest } from 'book-app-shared/types/BookRequest';

import { getStatus, Status } from 'app/constants/Status';
import { WishlistActionName } from 'app/constants/action-names/wishlist';

import { WishlistAction } from './wishlistAction';


export interface WishlistState {
  wishlist: Status<BookRequest[]>;
  bookedBookRequests: Status<BookRequest[]>;
}

const initialState: WishlistState = {
  wishlist: getStatus.idle(),
  bookedBookRequests: getStatus.idle(),
};

const reducer = {
  setWishlist: (state: WishlistState, wishlist: Status<BookRequest[]>): WishlistState => ({
    ...state,
    wishlist,
  }),
  setBookedBookRequests: (state: WishlistState, bookedBookRequests: Status<BookRequest[]>): WishlistState => ({
    ...state,
    bookedBookRequests,
  }),
};


export const wishlistReducer: Reducer<WishlistState, WishlistAction> = (state = initialState, action) => {
  switch (action.type) {
    case WishlistActionName.START_GET_WISHLIST:
      return reducer.setWishlist(state, getStatus.loading());
    case WishlistActionName.GET_WISHLIST_SUCCEEDED:
      return reducer.setWishlist(state, getStatus.success(action.payload));
    case WishlistActionName.GET_WISHLIST_FAILED:
      return reducer.setWishlist(state, getStatus.failure(action.payload));

    case WishlistActionName.START_GET_ALL_BOOKED_BOOK_REQUESTS:
      return reducer.setBookedBookRequests(state, getStatus.loading());
    case WishlistActionName.GET_ALL_BOOKED_BOOK_REQUESTS_SUCCEEDED:
      return reducer.setBookedBookRequests(state, getStatus.success(action.payload));
    case WishlistActionName.GET_ALL_BOOKED_BOOK_REQUESTS_FAILED:
      return reducer.setBookedBookRequests(state, getStatus.failure(action.payload));
    default:
      return state;
  }
};
