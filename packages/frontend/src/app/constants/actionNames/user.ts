enum UserStartActionName {
  START_GET_CURRENT_USER = 'user/START_GET_CURRENT_USER',
  START_GET_PUBLIC_USERS = 'user/START_GET_PUBLIC_USERS',
  START_DELETE = 'user/START_DELETE',
  START_UPDATE = 'user/START_UPDATE',
}

enum UserSucceededActionName {
  GET_CURRENT_USER_SUCCEEDED = 'user/START_GET_CURRENT_USER_SUCCEEDED',
  GET_PUBLIC_USERS_SUCCEEDED = 'user/START_GET_PUBLIC_USERS_SUCCEEDED',
}

export enum UserSucceededWithMessage {
  DELETE_SUCCEEDED = 'user/DELETE_SUCCEEDED',
  UPDATE_SUCCEEDED = 'user/UPDATE_SUCCEEDED',
}

export enum UserFailedActionName {
  GET_CURRENT_USER_FAILED = 'user/START_GET_CURRENT_USER_FAILED',
  GET_PUBLIC_USERS_FAILED = 'user/START_GET_PUBLIC_USERS_FAILED',
  DELETE_FAILED = 'user/DELETE_FAILED',
  UPDATE_FAILED = 'user/UPDATE_FAILED',
}

export const UserActionName = {
  ...UserStartActionName,
  ...UserSucceededWithMessage,
  ...UserSucceededActionName,
  ...UserFailedActionName,
};
