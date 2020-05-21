import { createSelector } from 'reselect';

import { isNull } from 'book-app-shared/helpers/typeChecks';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';
import { getIdMap } from 'app/helpers/getIdMap';

import { WishlistState } from './wishlistReducer';
import { sortByInnerNumber } from '../../helpers/sort/sortByInnerNumber';


const getWishlistState = (state: AppState): WishlistState => state.wishlistState;

const getWishlistStatus = createSelector(getWishlistState, (wishlistState) => wishlistState.wishlist);
const getWishlist = createSelector(getWishlistStatus, (wishlistStatus) => getData(wishlistStatus));
const getWishlistMap = createSelector(getWishlist, (wishlist) => getIdMap('bookDataId', wishlist));

const getWishlistFiltered = createSelector(getWishlist, (wishlist) => wishlist?.filter((bookRequest) => !bookRequest.createdByBookingUser));
const getStopActive = createSelector(getWishlist, (wishlist) => wishlist?.some((bookRequest) => !isNull(bookRequest.userBookingId)));


const getBookedBookRequestsStatus = createSelector(getWishlistState, (wishlistState) => wishlistState.bookedBookRequests);
const getBookedBookRequests = createSelector(getBookedBookRequestsStatus, (bookedBookRequest) => getData(bookedBookRequest));

const getWishlistSorted = createSelector(getWishlist, (wishlist) => wishlist?.sort(sortByInnerNumber('bookDataId')));
const getBookedBookRequestsSorted = createSelector(getBookedBookRequests, (bookedBookRequest) => bookedBookRequest?.sort(sortByInnerNumber('bookDataId')));

export const wishlistSelector = {
  getWishlistStatus,
  getBookedBookRequestsStatus,

  getWishlist,
  getStopActive,
  getWishlistFiltered,
  getWishlistMap,
  getBookedBookRequests,

  getWishlistSorted,
  getBookedBookRequestsSorted,
};
