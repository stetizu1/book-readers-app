import { ActionType, createAction } from 'typesafe-actions';

import { BookDataWithReview } from 'book-app-shared/types/BookData';
import { FriendsDataActionName } from 'app/constants/action-names/friends-data';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';


export const friendsDataAction = {
  startReadAllBookDataWithReviews: createAction(FriendsDataActionName.START_READ_ALL_FRIENDS_BOOK_DATA_WITH_REVIEWS)(),
  readAllBookDataWithReviewsSucceeded: createAction(FriendsDataActionName.READ_ALL_FRIENDS_BOOK_DATA_WITH_REVIEWS_SUCCEEDED)<BookDataWithReview[]>(),
  readAllBookDataWithReviewsFailed: createAction(FriendsDataActionName.READ_ALL_FRIENDS_BOOK_DATA_WITH_REVIEWS_FAILED)<string>(),

  startReadAllBookRequests: createAction(FriendsDataActionName.START_READ_ALL_FRIENDS_BOOK_REQUESTS)(),
  readAllBookRequestsSucceeded: createAction(FriendsDataActionName.READ_ALL_FRIENDS_BOOK_REQUESTS_SUCCEEDED)<BookRequestWithBookData[]>(),
  readAllBookRequestsFailed: createAction(FriendsDataActionName.READ_ALL_FRIENDS_BOOK_REQUESTS_FAILED)<string>(),
};

export type FriendsDataAction = ActionType<typeof friendsDataAction>;
