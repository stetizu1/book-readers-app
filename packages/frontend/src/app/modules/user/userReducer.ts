import { User } from 'book-app-shared/types/User';
import { Reducer } from 'redux';

import { createStatus, Status } from 'app/constants/Status';
import { UserActionName } from 'app/constants/action-names/user';

import { UserAction } from './userAction';


export interface UserState {
  currentUser: Status<User>;
  users: Status<User[]>;
  searchEmail?: {
    email: string;
    result: Status<User>;
  };
}

const initialState: UserState = {
  currentUser: createStatus.idle(),
  users: createStatus.idle(),
};

const reducer = {
  setCurrentUser: (state: UserState, currentUser: Status<User>): UserState => ({
    ...state,
    currentUser,
  }),
  setUsers: (state: UserState, users: Status<User[]>): UserState => ({
    ...state,
    users,
  }),
  setLoading: (state: UserState): UserState => ({
    ...state,
    currentUser: createStatus.loading(),
    users: createStatus.loading(),
  }),
};


export const userReducer: Reducer<UserState, UserAction> = (state = initialState, action) => {
  switch (action.type) {
    case UserActionName.START_READ_CURRENT_USER:
      return reducer.setCurrentUser(state, createStatus.loading());

    case UserActionName.READ_CURRENT_USER_SUCCEEDED:
      return reducer.setCurrentUser(state, createStatus.success(action.payload));

    case UserActionName.READ_CURRENT_USER_FAILED:
      return reducer.setCurrentUser(state, createStatus.failure());


    case UserActionName.START_READ_ALL_USERS:
      return reducer.setUsers(state, createStatus.loading());

    case UserActionName.READ_ALL_USERS_SUCCEEDED:
      return reducer.setUsers(state, createStatus.success(action.payload));

    case UserActionName.READ_ALL_USERS_FAILED:
      return reducer.setUsers(state, createStatus.failure());

    case UserActionName.START_UPDATE_USER:
      return reducer.setLoading(state);


    default:
      return state;
  }
};
