enum FriendshipStartActionName {
  START_GET_ALL_FRIENDS = 'bookData/START_GET_ALL_FRIENDS',

  START_CREATE_FRIENDSHIP = 'bookData/START_CREATE_FRIENDSHIP',
  START_CONFIRM_FRIENDSHIP = 'bookData/START_CONFIRM_FRIENDSHIP',
  START_DELETE_FRIENDSHIP = 'bookData/START_DELETE_FRIENDSHIP'
}

enum FriendshipSucceededActionName {
  GET_ALL_FRIENDS_SUCCEEDED = 'bookData/GET_ALL_FRIENDS_SUCCEEDED',
}

export enum FriendshipSucceededWithMessageActionName {
  CREATE_FRIENDSHIP_SUCCEEDED = 'bookData/CREATE_BOOK_DATA_SUCCEEDED',
  CONFIRM_FRIENDSHIP_SUCCEEDED = 'bookData/UPDATE_BOOK_DATA_SUCCEEDED',
  DELETE_FRIENDSHIP_SUCCEEDED = 'bookData/DELETE_BOOK_DATA_SUCCEEDED',
}

export enum FriendshipFailedActionName {
  GET_ALL_FRIENDSHIP_FAILED = 'bookData/GET_ALL_FRIENDSHIP_FAILED',

  CREATE_FRIENDSHIP_FAILED = 'bookData/CREATE_BOOK_DATA_FAILED',
  CONFIRM_FRIENDSHIP_FAILED = 'bookData/UPDATE_BOOK_DATA_FAILED',
  DELETE_FRIENDSHIP_FAILED = 'bookData/DELETE_BOOK_DATA_FAILED',
}

export const FriendshipActionName = {
  ...FriendshipStartActionName,
  ...FriendshipSucceededWithMessageActionName,
  ...FriendshipSucceededActionName,
  ...FriendshipFailedActionName,
};
