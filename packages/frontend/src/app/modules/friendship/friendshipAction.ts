import { ActionType, createAction } from 'typesafe-actions';

import { FriendshipActionName } from 'app/constants/action-names/friendship';
import { withIdAndData, withSuccessMessage } from 'app/helpers/action/wrapPayload';
import { Friendship, FriendshipCreate, FriendshipUpdate } from 'book-app-shared/types/Friendship';


export const friendshipAction = {
  startGetAllFriendship: createAction(FriendshipActionName.START_GET_ALL_FRIENDS)(),
  getAllFriendshipSucceeded: createAction(FriendshipActionName.GET_ALL_FRIENDS_SUCCEEDED)<Friendship[]>(),
  getAllFriendshipFailed: createAction(FriendshipActionName.GET_ALL_FRIENDSHIP_FAILED)<string>(),

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
