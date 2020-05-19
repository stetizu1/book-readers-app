enum FriendsDataStartActionName {
  START_READ_ALL_BOOK_DATA_WITH_REVIEWS = 'reviews/START_READ_ALL_BOOK_DATA_WITH_REVIEWS',
}

enum FriendsDataSucceededActionName {
  READ_ALL_BOOK_DATA_WITH_REVIEWS_SUCCEEDED = 'reviews/READ_ALL_BOOK_DATA_WITH_REVIEWS_SUCCEEDED',
}

export enum FriendsDataFailedActionName {
  READ_ALL_BOOK_DATA_WITH_REVIEWS_FAILED = 'reviews/READ_ALL_BOOK_DATA_WITH_REVIEWS_FAILED',
}

export const FriendsDataActionName = {
  ...FriendsDataStartActionName,
  ...FriendsDataSucceededActionName,
  ...FriendsDataFailedActionName,
};
