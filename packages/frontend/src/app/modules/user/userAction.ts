import { ActionType, createAction } from 'typesafe-actions';

import { User, UserUpdate } from 'book-app-shared/types/User';

import { UserActionName } from 'app/constants/action-names/user';
import { dataAndId, dataAndSuccessMessage } from 'app/helpers/action/wrapPayload';


export const userAction = {
  startReadCurrentUser: createAction(UserActionName.START_READ_CURRENT_USER)(),
  readCurrentUserSucceeded: createAction(UserActionName.READ_CURRENT_USER_SUCCEEDED)<User>(),
  readCurrentUserFailed: createAction(UserActionName.READ_CURRENT_USER_FAILED)<string>(),

  startReadUsers: createAction(UserActionName.START_READ_ALL_USERS)(),
  readUsersSucceeded: createAction(UserActionName.READ_ALL_USERS_SUCCEEDED)<User[]>(),
  readUsersFailed: createAction(UserActionName.READ_ALL_USERS_FAILED)<string>(),

  startUpdateUser: createAction(UserActionName.START_UPDATE_USER, dataAndId<UserUpdate>())(),
  updateUserSucceeded: createAction(UserActionName.UPDATE_USER_SUCCEEDED, dataAndSuccessMessage<User>())(),
  updateUserFailed: createAction(UserActionName.UPDATE_USER_FAILED)<string>(),

  startDeleteUser: createAction(UserActionName.START_DELETE_USER)<number>(),
  deleteUserSucceeded: createAction(UserActionName.DELETE_USER_SUCCEEDED, dataAndSuccessMessage<User>())(),
  deleteUserFailed: createAction(UserActionName.DELETE_USER_FAILED)<string>(),
};

export type UserAction = ActionType<typeof userAction>;
