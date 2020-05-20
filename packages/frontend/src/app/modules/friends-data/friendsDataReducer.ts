import { Reducer } from 'redux';

import { BookDataWithReview } from 'book-app-shared/types/BookData';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';

import { createStatus, Status } from 'app/constants/Status';
import { FriendsDataActionName } from 'app/constants/action-names/friends-data';

import { FriendsDataAction } from './friendsDataAction';


export interface FriendsDataState {
  bookDataWithReview: Status<BookDataWithReview[]>;
  bookRequests: Status<BookRequestWithBookData[]>;
}

const initialState: FriendsDataState = {
  bookDataWithReview: createStatus.idle(),
  bookRequests: createStatus.idle(),
};

const reducer = {
  setBookDataWithReview: (state: FriendsDataState, bookDataWithReview: Status<BookDataWithReview[]>): FriendsDataState => ({
    ...state,
    bookDataWithReview,
  }),
  setBookRequests: (state: FriendsDataState, bookRequests: Status<BookRequestWithBookData[]>): FriendsDataState => ({
    ...state,
    bookRequests,
  }),
};


export const friendsDataReducer: Reducer<FriendsDataState, FriendsDataAction> = (state = initialState, action) => {
  switch (action.type) {
    case FriendsDataActionName.START_READ_ALL_BOOK_DATA_WITH_REVIEWS:
      return reducer.setBookDataWithReview(state, createStatus.loading());
    case FriendsDataActionName.READ_ALL_BOOK_DATA_WITH_REVIEWS_SUCCEEDED:
      return reducer.setBookDataWithReview(state, createStatus.success(action.payload));
    case FriendsDataActionName.READ_ALL_BOOK_DATA_WITH_REVIEWS_FAILED:
      return reducer.setBookDataWithReview(state, createStatus.failure());

    case FriendsDataActionName.START_READ_ALL_BOOK_REQUESTS:
      return reducer.setBookRequests(state, createStatus.loading());
    case FriendsDataActionName.READ_ALL_BOOK_REQUESTS_SUCCEEDED:
      return reducer.setBookRequests(state, createStatus.success(action.payload));
    case FriendsDataActionName.READ_ALL_BOOK_REQUESTS_FAILED:
      return reducer.setBookRequests(state, createStatus.failure());

    default:
      return state;
  }
};
