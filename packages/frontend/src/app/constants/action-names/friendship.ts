enum FriendshipStartActionName {
  START_READ_ALL_FRIENDS = 'friendship/START_READ_ALL_FRIENDS',
  START_READ_USER_BY_EMAIL = 'friendship/START_READ_USER_BY_EMAIL',

  START_CREATE_FRIENDSHIP = 'friendship/START_CREATE_FRIENDSHIP',
  START_CONFIRM_FRIENDSHIP = 'friendship/START_CONFIRM_FRIENDSHIP',
  START_DELETE_FRIENDSHIP = 'friendship/START_DELETE_FRIENDSHIP'
}

enum FriendshipSucceededActionName {
  READ_ALL_FRIENDS_SUCCEEDED = 'friendship/READ_ALL_FRIENDS_SUCCEEDED',
  READ_USER_BY_EMAIL_SUCCEEDED = 'friendship/READ_USER_BY_EMAIL_SUCCEEDED',
}

export enum FriendshipSucceededWithMessageActionName {
  CREATE_FRIENDSHIP_SUCCEEDED = 'friendship/CREATE_BOOK_DATA_SUCCEEDED',
  CONFIRM_FRIENDSHIP_SUCCEEDED = 'friendship/UPDATE_BOOK_DATA_SUCCEEDED',
  DELETE_FRIENDSHIP_SUCCEEDED = 'friendship/DELETE_BOOK_DATA_SUCCEEDED',
}

export enum FriendshipFailedActionName {
  READ_ALL_FRIENDSHIP_FAILED = 'friendship/READ_ALL_FRIENDSHIP_FAILED',

  CREATE_FRIENDSHIP_FAILED = 'friendship/CREATE_BOOK_DATA_FAILED',
  CONFIRM_FRIENDSHIP_FAILED = 'friendship/UPDATE_BOOK_DATA_FAILED',
  DELETE_FRIENDSHIP_FAILED = 'friendship/DELETE_BOOK_DATA_FAILED',
}

enum FriendshipOtherActionName {
  REFRESH_SEARCH_USER_BY_EMAIL = 'friendship/REFRESH_SEARCH_USER_BY_EMAIL',
  READ_USER_BY_EMAIL_FAILED = 'friendship/READ_USER_BY_EMAIL_FAILED',
}

export const FriendshipActionName = {
  ...FriendshipStartActionName,
  ...FriendshipSucceededWithMessageActionName,
  ...FriendshipSucceededActionName,
  ...FriendshipFailedActionName,
  ...FriendshipOtherActionName,
};
