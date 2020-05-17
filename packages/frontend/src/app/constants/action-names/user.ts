enum UserStartActionName {
  START_GET_CURRENT_USER = 'user/START_GET_CURRENT_USER',
  START_GET_USERS = 'user/START_GET_PUBLIC_USERS',
  START_UPDATE = 'user/START_UPDATE',
  START_DELETE = 'user/START_DELETE',
}

enum UserSucceededActionName {
  GET_CURRENT_USER_SUCCEEDED = 'user/START_GET_CURRENT_USER_SUCCEEDED',
  GET_USERS_SUCCEEDED = 'user/START_GET_PUBLIC_USERS_SUCCEEDED',
}

export enum UserSucceededWithMessageActionName {
  UPDATE_SUCCEEDED = 'user/UPDATE_SUCCEEDED',
  DELETE_SUCCEEDED = 'user/DELETE_SUCCEEDED',
}

export enum UserFailedActionName {
  GET_CURRENT_USER_FAILED = 'user/START_GET_CURRENT_USER_FAILED',
  GET_USERS_FAILED = 'user/START_GET_PUBLIC_USERS_FAILED',
  UPDATE_FAILED = 'user/UPDATE_FAILED',
  DELETE_FAILED = 'user/DELETE_FAILED',
}

export const UserActionName = {
  ...UserStartActionName,
  ...UserSucceededWithMessageActionName,
  ...UserSucceededActionName,
  ...UserFailedActionName,
};
