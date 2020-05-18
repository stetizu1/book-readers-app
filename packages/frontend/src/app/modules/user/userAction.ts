import { ActionType, createAction } from 'typesafe-actions';

import { User, UserUpdate } from 'book-app-shared/types/User';

import { UserActionName } from 'app/constants/action-names/user';
import { withIdAndData, withSuccessMessage } from 'app/helpers/action/wrapPayload';


export const userAction = {
  startReadCurrentUser: createAction(UserActionName.START_READ_CURRENT_USER)(),
  readCurrentUserSucceeded: createAction(UserActionName.READ_CURRENT_USER_SUCCEEDED)<User>(),
  readCurrentUserFailed: createAction(UserActionName.READ_CURRENT_USER_FAILED)<string>(),

  startReadUsers: createAction(UserActionName.START_READ_USERS)(),
  readUsersSucceeded: createAction(UserActionName.READ_USERS_SUCCEEDED)<User[]>(),
  readUsersFailed: createAction(UserActionName.READ_USERS_FAILED)<string>(),

  startUpdateUser: createAction(UserActionName.START_UPDATE, withIdAndData<UserUpdate>())(),
  updateUserSucceeded: createAction(UserActionName.UPDATE_SUCCEEDED, withSuccessMessage<User>())(),
  updateUserFailed: createAction(UserActionName.UPDATE_FAILED)<string>(),

  startDeleteUser: createAction(UserActionName.START_DELETE)<number>(),
  deleteUserSucceeded: createAction(UserActionName.DELETE_SUCCEEDED, withSuccessMessage<User>())(),
  deleteUserFailed: createAction(UserActionName.DELETE_FAILED)<string>(),
};

export type UserAction = ActionType<typeof userAction>;
