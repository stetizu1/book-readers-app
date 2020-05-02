import { User } from 'book-app-shared/types/User';
import { Reducer } from 'redux';
import { getStatus, Status } from '../../constants/Status';
import { UserAction } from './userAction';
import { UserActionName } from '../../constants/actionNames/user';


export interface UserState {
  currentUser: Status<User>;
  publicUsers: Status<User[]>;
  searchEmail?: {
    email: string;
    result: Status<User>;
  };
}

const initialState: UserState = {
  currentUser: getStatus.idle(),
  publicUsers: getStatus.idle(),
};

const reducer = {
  setCurrentUser: (state: UserState, currentUser: Status<User>): UserState => ({
    ...state,
    currentUser,
  }),
  setPublicUsers: (state: UserState, publicUsers: Status<User[]>): UserState => ({
    ...state,
    publicUsers,
  }),
};


export const userReducer: Reducer<UserState, UserAction> = (state = initialState, action) => {
  switch (action.type) {
    case UserActionName.START_GET_CURRENT_USER:
      return reducer.setCurrentUser(state, getStatus.loading());

    case UserActionName.GET_CURRENT_USER_SUCCEEDED:
      return reducer.setCurrentUser(state, getStatus.success(action.payload));

    case UserActionName.GET_CURRENT_USER_FAILED:
      return reducer.setCurrentUser(state, getStatus.failure(action.payload));


    case UserActionName.START_GET_PUBLIC_USERS:
      return reducer.setPublicUsers(state, getStatus.loading());

    case UserActionName.GET_PUBLIC_USERS_SUCCEEDED:
      return reducer.setPublicUsers(state, getStatus.success(action.payload));

    case UserActionName.GET_PUBLIC_USERS_FAILED:
      return reducer.setPublicUsers(state, getStatus.failure(action.payload));


    default:
      return state;
  }
};
