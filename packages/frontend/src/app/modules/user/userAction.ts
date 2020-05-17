import { ActionType, createAction } from 'typesafe-actions';

import { User, UserUpdate } from 'book-app-shared/types/User';

import { UserActionName } from 'app/constants/action-names/user';
import { withIdAndData, withSuccessMessage } from 'app/helpers/action/wrapPayload';


export const userAction = {
  startGetCurrentUser: createAction(UserActionName.START_GET_CURRENT_USER)(),
  getCurrentUserSucceeded: createAction(UserActionName.GET_CURRENT_USER_SUCCEEDED)<User>(),
  getCurrentUserFailed: createAction(UserActionName.GET_CURRENT_USER_FAILED)<string>(),

  startGetUsers: createAction(UserActionName.START_GET_USERS)(),
  getUsersSucceeded: createAction(UserActionName.GET_USERS_SUCCEEDED)<User[]>(),
  getUsersFailed: createAction(UserActionName.GET_USERS_FAILED)<string>(),

  startUpdateUser: createAction(UserActionName.START_UPDATE, withIdAndData<UserUpdate>())(),
  updateUserSucceeded: createAction(UserActionName.UPDATE_SUCCEEDED, withSuccessMessage<User>())(),
  updateUserFailed: createAction(UserActionName.UPDATE_FAILED)<string>(),

  startDeleteUser: createAction(UserActionName.START_DELETE)<number>(),
  deleteUserSucceeded: createAction(UserActionName.DELETE_SUCCEEDED, withSuccessMessage<User>())(),
  deleteUserFailed: createAction(UserActionName.DELETE_FAILED)<string>(),
};

export type UserAction = ActionType<typeof userAction>;
