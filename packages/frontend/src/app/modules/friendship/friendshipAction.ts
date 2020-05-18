import { ActionType, createAction } from 'typesafe-actions';

import { Friendship, FriendshipCreate, FriendshipUpdate } from 'book-app-shared/types/Friendship';
import { User } from 'book-app-shared/types/User';

import { FriendshipActionName } from 'app/constants/action-names/friendship';
import { withIdAndData, withSuccessMessage } from 'app/helpers/action/wrapPayload';


export const friendshipAction = {
  startReadAllFriendship: createAction(FriendshipActionName.START_READ_ALL_FRIENDS)(),
  readAllFriendshipSucceeded: createAction(FriendshipActionName.READ_ALL_FRIENDS_SUCCEEDED)<Friendship[]>(),
  readAllFriendshipFailed: createAction(FriendshipActionName.READ_ALL_FRIENDSHIP_FAILED)<string>(),

  startReadUserByEmail: createAction(FriendshipActionName.START_READ_USER_BY_EMAIL)<string>(),
  readUserByEmailSucceeded: createAction(FriendshipActionName.READ_USER_BY_EMAIL_SUCCEEDED)<User>(),
  readUserByEmailFailed: createAction(FriendshipActionName.READ_USER_BY_EMAIL_FAILED)<string>(),
  refreshUserReadByEmail: createAction(FriendshipActionName.REFRESH_SEARCH_USER_BY_EMAIL)(),

  startCreateFriendship: createAction(FriendshipActionName.START_CREATE_FRIENDSHIP)<FriendshipCreate>(),
  createFriendshipSucceeded: createAction(FriendshipActionName.CREATE_FRIENDSHIP_SUCCEEDED, withSuccessMessage<Friendship>())(),
  createFriendshipFailed: createAction(FriendshipActionName.CREATE_FRIENDSHIP_FAILED)<string>(),

  startConfirmFriendship: createAction(FriendshipActionName.START_CONFIRM_FRIENDSHIP, withIdAndData<FriendshipUpdate>())(),
  confirmFriendshipSucceeded: createAction(FriendshipActionName.CONFIRM_FRIENDSHIP_SUCCEEDED, withSuccessMessage<Friendship>())(),
  confirmFriendshipFailed: createAction(FriendshipActionName.CONFIRM_FRIENDSHIP_FAILED)<string>(),

  startDeleteFriendship: createAction(FriendshipActionName.START_DELETE_FRIENDSHIP)<number>(),
  deleteFriendshipSucceeded: createAction(FriendshipActionName.DELETE_FRIENDSHIP_SUCCEEDED, withSuccessMessage<Friendship>())(),
  deleteFriendshipFailed: createAction(FriendshipActionName.DELETE_FRIENDSHIP_FAILED)<string>(),
};

export type FriendshipAction = ActionType<typeof friendshipAction>;
