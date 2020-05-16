enum FriendshipStartActionName {
  START_GET_ALL_FRIENDS = 'friends/START_GET_ALL_FRIENDS',
  START_GET_USER_BY_EMAIL = 'friends/START_GET_USER_BY_EMAIL',

  START_CREATE_FRIENDSHIP = 'friends/START_CREATE_FRIENDSHIP',
  START_CONFIRM_FRIENDSHIP = 'friends/START_CONFIRM_FRIENDSHIP',
  START_DELETE_FRIENDSHIP = 'friends/START_DELETE_FRIENDSHIP'
}

enum FriendshipSucceededActionName {
  GET_ALL_FRIENDS_SUCCEEDED = 'friends/GET_ALL_FRIENDS_SUCCEEDED',
  GET_USER_BY_EMAIL_SUCCEEDED = 'friends/GET_USER_BY_EMAIL_SUCCEEDED',
}

export enum FriendshipSucceededWithMessageActionName {
  CREATE_FRIENDSHIP_SUCCEEDED = 'friends/CREATE_BOOK_DATA_SUCCEEDED',
  CONFIRM_FRIENDSHIP_SUCCEEDED = 'friends/UPDATE_BOOK_DATA_SUCCEEDED',
  DELETE_FRIENDSHIP_SUCCEEDED = 'friends/DELETE_BOOK_DATA_SUCCEEDED',
}

export enum FriendshipFailedActionName {
  GET_ALL_FRIENDSHIP_FAILED = 'friends/GET_ALL_FRIENDSHIP_FAILED',

  CREATE_FRIENDSHIP_FAILED = 'friends/CREATE_BOOK_DATA_FAILED',
  CONFIRM_FRIENDSHIP_FAILED = 'friends/UPDATE_BOOK_DATA_FAILED',
  DELETE_FRIENDSHIP_FAILED = 'friends/DELETE_BOOK_DATA_FAILED',
}

enum FriendshipOtherActionName {
  REFRESH_SEARCH_USER_BY_EMAIL = 'REFRESH_SEARCH_USER_BY_EMAIL',
  GET_USER_BY_EMAIL_FAILED = 'friends/GET_USER_BY_EMAIL_FAILED',
}

export const FriendshipActionName = {
  ...FriendshipStartActionName,
  ...FriendshipSucceededWithMessageActionName,
  ...FriendshipSucceededActionName,
  ...FriendshipFailedActionName,
  ...FriendshipOtherActionName,
};
