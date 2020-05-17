import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';
import { getIdMap } from 'app/helpers/getIdMap';

import { WishlistState } from './wishlistReducer';


const getWishlistState = (state: AppState): WishlistState => state.wishlistState;

const getWishlistStatus = createSelector(getWishlistState, (wishlistState) => wishlistState.wishlist);
const getWishlist = createSelector(getWishlistStatus, (wishlistStatus) => getData(wishlistStatus));
const getWishlistMap = createSelector(getWishlist, (wishlist) => getIdMap('bookDataId', wishlist));

const getWishlistFiltered = createSelector(getWishlist, (wishlist) => wishlist?.filter((bookRequest) => !bookRequest.createdByBookingUser));


const getBookedBookRequestStatus = createSelector(getWishlistState, (wishlistState) => wishlistState.bookedBookRequests);
const getBookedBookRequest = createSelector(getBookedBookRequestStatus, (bookedBookRequest) => getData(bookedBookRequest));


export const wishlistSelector = {
  getWishlistStatus,

  getWishlist,
  getWishlistFiltered,
  getWishlistMap,
  getBookedBookRequest,
};
