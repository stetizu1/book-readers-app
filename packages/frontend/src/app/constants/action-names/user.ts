enum UserStartActionName {
  START_READ_CURRENT_USER = 'user/START_READ_CURRENT_USER',
  START_READ_ALL_USERS = 'user/START_READ_ALL_USERS',
  START_UPDATE_USER = 'user/START_UPDATE_USER',
  START_DELETE_USER = 'user/START_DELETE_USER',
}

enum UserSucceededActionName {
  READ_CURRENT_USER_SUCCEEDED = 'user/READ_CURRENT_USER_SUCCEEDED',
  READ_ALL_USERS_SUCCEEDED = 'user/READ_ALL_USERS_SUCCEEDED',
}

export enum UserSucceededWithMessageActionName {
  UPDATE_USER_SUCCEEDED = 'user/UPDATE_USER_SUCCEEDED',
  DELETE_USER_SUCCEEDED = 'user/DELETE_USER_SUCCEEDED',
}

export enum UserFailedActionName {
  READ_CURRENT_USER_FAILED = 'user/READ_CURRENT_USER_FAILED',
  READ_ALL_USERS_FAILED = 'user/READ_ALL_USERS_FAILED',
  UPDATE_USER_FAILED = 'user/UPDATE_USER_FAILED',
  DELETE_USER_FAILED = 'user/DELETE_USER_FAILED',
}

export const UserActionName = {
  ...UserStartActionName,
  ...UserSucceededWithMessageActionName,
  ...UserSucceededActionName,
  ...UserFailedActionName,
};
