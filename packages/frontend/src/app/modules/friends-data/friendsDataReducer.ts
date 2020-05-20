import { Reducer } from 'redux';

import { BookDataWithReview } from 'book-app-shared/types/BookData';

import { createStatus, Status } from 'app/constants/Status';

import { FriendsDataAction } from './friendsDataAction';
import { FriendsDataActionName } from '../../constants/action-names/friends-data';


export interface FriendsDataState {
  bookDataWithReview: Status<BookDataWithReview[]>;
}

const initialState: FriendsDataState = {
  bookDataWithReview: createStatus.idle(),
};

const reducer = {
  setBookDataWithReview: (state: FriendsDataState, bookDataWithReview: Status<BookDataWithReview[]>): FriendsDataState => ({
    ...state,
    bookDataWithReview,
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

    default:
      return state;
  }
};
