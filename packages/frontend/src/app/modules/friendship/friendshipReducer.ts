import { Reducer } from 'redux';

import { Friendship } from 'book-app-shared/types/Friendship';

import { getStatus, Status } from 'app/constants/Status';
import { FriendshipActionName } from 'app/constants/action-names/friendship';

import { FriendshipAction } from './friendshipAction';


export interface FriendshipState {
  friendships: Status<Friendship[]>;
}

const initialState: FriendshipState = {
  friendships: getStatus.idle(),
};

const reducer = {
  setFriendship: (state: FriendshipState, friendships: Status<Friendship[]>): FriendshipState => ({
    ...state,
    friendships,
  }),
};


export const friendshipReducer: Reducer<FriendshipState, FriendshipAction> = (state = initialState, action) => {
  switch (action.type) {
    case FriendshipActionName.START_GET_ALL_FRIENDS:
      return reducer.setFriendship(state, getStatus.loading());
    case FriendshipActionName.GET_ALL_FRIENDS_SUCCEEDED:
      return reducer.setFriendship(state, getStatus.success(action.payload));
    case FriendshipActionName.GET_ALL_FRIENDSHIP_FAILED:
      return reducer.setFriendship(state, getStatus.failure(action.payload));
    default:
      return state;
  }
};
