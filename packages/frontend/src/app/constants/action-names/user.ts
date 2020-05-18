enum UserStartActionName {
  START_READ_CURRENT_USER = 'user/START_READ_CURRENT_USER',
  START_READ_USERS = 'user/START_READ_USERS',
  START_UPDATE = 'user/START_UPDATE',
  START_DELETE = 'user/START_DELETE',
}

enum UserSucceededActionName {
  READ_CURRENT_USER_SUCCEEDED = 'user/READ_CURRENT_USER_SUCCEEDED',
  READ_USERS_SUCCEEDED = 'user/READ_USERS_SUCCEEDED',
}

export enum UserSucceededWithMessageActionName {
  UPDATE_SUCCEEDED = 'user/UPDATE_SUCCEEDED',
  DELETE_SUCCEEDED = 'user/DELETE_SUCCEEDED',
}

export enum UserFailedActionName {
  READ_CURRENT_USER_FAILED = 'user/READ_CURRENT_USER_FAILED',
  READ_USERS_FAILED = 'user/READ_USERS_FAILED',
  UPDATE_FAILED = 'user/UPDATE_FAILED',
  DELETE_FAILED = 'user/DELETE_FAILED',
}

export const UserActionName = {
  ...UserStartActionName,
  ...UserSucceededWithMessageActionName,
  ...UserSucceededActionName,
  ...UserFailedActionName,
};
