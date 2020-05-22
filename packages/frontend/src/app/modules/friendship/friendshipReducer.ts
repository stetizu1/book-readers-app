import { Reducer } from 'redux';

import { Friendship } from 'book-app-shared/types/Friendship';
import { User } from 'book-app-shared/types/User';

import { createStatus, Status } from 'app/constants/Status';
import { FriendshipActionName } from 'app/constants/action-names/friendship';

import { FriendshipAction } from './friendshipAction';


export interface FriendshipState {
  friendships: Status<Friendship[]>;
  searchedUser: Status<User>;
}

const initialState: FriendshipState = {
  friendships: createStatus.idle(),
  searchedUser: createStatus.idle(),
};

const reducer = {
  setFriendship: (state: FriendshipState, friendships: Status<Friendship[]>): FriendshipState => ({
    ...state,
    friendships,
  }),
  setSearchedUser: (state: FriendshipState, searchedUser: Status<User>): FriendshipState => ({
    ...state,
    searchedUser,
  }),
};


export const friendshipReducer: Reducer<FriendshipState, FriendshipAction> = (state = initialState, action) => {
  switch (action.type) {
    case FriendshipActionName.START_READ_ALL_FRIENDS:
      return reducer.setFriendship(state, createStatus.loading());
    case FriendshipActionName.READ_ALL_FRIENDS_SUCCEEDED:
      return reducer.setFriendship(state, createStatus.success(action.payload));
    case FriendshipActionName.READ_ALL_FRIENDSHIP_FAILED:
      return reducer.setFriendship(state, createStatus.failure());

    case FriendshipActionName.REFRESH_SEARCH_USER_BY_EMAIL:
      return reducer.setSearchedUser(state, createStatus.idle());
    case FriendshipActionName.START_READ_USER_BY_EMAIL:
      return reducer.setSearchedUser(state, createStatus.loading());
    case FriendshipActionName.READ_USER_BY_EMAIL_SUCCEEDED:
      return reducer.setSearchedUser(state, createStatus.success(action.payload));
    case FriendshipActionName.READ_USER_BY_EMAIL_FAILED:
      return reducer.setSearchedUser(state, createStatus.failure());
    default:
      return state;
  }
};
