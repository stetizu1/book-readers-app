import { ActionType, createAction } from 'typesafe-actions';

import { User } from 'book-app-shared/types/User';

import { UserActionName } from '../../constants/actionNames/user';


export const userAction = {
  startGetCurrentUser: createAction(UserActionName.START_GET_CURRENT_USER)(),
  getCurrentUserSucceeded: createAction(UserActionName.GET_CURRENT_USER_SUCCEEDED)<User>(),
  getCurrentUserFailed: createAction(UserActionName.GET_CURRENT_USER_FAILED)<string>(),

  startGetPublicUsers: createAction(UserActionName.START_GET_PUBLIC_USERS)(),
  getPublicUsersSucceeded: createAction(UserActionName.GET_PUBLIC_USERS_SUCCEEDED)<User[]>(),
  getPublicUsersFailed: createAction(UserActionName.GET_PUBLIC_USERS_FAILED)<string>(),

  startDeleteUser: createAction(UserActionName.START_DELETE)<number>(),
};

export type UserAction = ActionType<typeof userAction>;
