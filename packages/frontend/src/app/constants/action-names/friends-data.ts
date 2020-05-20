enum FriendsDataStartActionName {
  START_READ_ALL_BOOK_DATA_WITH_REVIEWS = 'reviews/START_READ_ALL_BOOK_DATA_WITH_REVIEWS',
  START_READ_ALL_BOOK_REQUESTS = 'reviews/START_READ_ALL_BOOK_REQUESTS',
}

enum FriendsDataSucceededActionName {
  READ_ALL_BOOK_DATA_WITH_REVIEWS_SUCCEEDED = 'reviews/READ_ALL_BOOK_DATA_WITH_REVIEWS_SUCCEEDED',
  READ_ALL_BOOK_REQUESTS_SUCCEEDED = 'reviews/READ_ALL_BOOK_REQUESTS_SUCCEEDED',
}

export enum FriendsDataFailedActionName {
  READ_ALL_BOOK_DATA_WITH_REVIEWS_FAILED = 'reviews/READ_ALL_BOOK_DATA_WITH_REVIEWS_FAILED',
  READ_ALL_BOOK_REQUESTS_FAILED = 'reviews/READ_ALL_BOOK_REQUESTS_FAILED',
}

export const FriendsDataActionName = {
  ...FriendsDataStartActionName,
  ...FriendsDataSucceededActionName,
  ...FriendsDataFailedActionName,
};
