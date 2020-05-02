import { User } from 'book-app-shared/types/User';
import { Reducer } from 'redux';
import { getStatus, Status } from '../../constants/Status';
import { UserAction } from './userAction';
import { UserActionName } from '../../constants/actionNames/user';

export interface UserState {
  currentUser: Status<User>;
  publicProfiles: Status<User[]>;
  searchEmail?: {
    email: string;
    result: Status<User>;
  };
}

const initialState: UserState = {
  currentUser: getStatus.idle(),
  publicProfiles: getStatus.idle(),
};


export const userReducer: Reducer<UserState, UserAction> = (state = initialState, action) => {
  switch (action.type) {
    case UserActionName.START_GET_CURRENT_USER:
      return {
        ...state,
        currentUser: getStatus.loading(),
      };

    case UserActionName.GET_CURRENT_USER_SUCCEEDED:
      return {
        ...state,
        currentUser: getStatus.success(action.payload),
      };

    case UserActionName.START_GET_PUBLIC_USERS:
      return {
        ...state,
        publicProfiles: getStatus.loading(),
      };
    case UserActionName.GET_PUBLIC_USERS_SUCCEEDED:
      return {
        ...state,
        publicProfiles: getStatus.success(action.payload),
      };

    case UserActionName.GET_CURRENT_USER_FAILED:
      return {
        ...state,
        currentUser: getStatus.failure(action.payload),
      };
    case UserActionName.GET_PUBLIC_USERS_FAILED:
      return {
        ...state,
        publicProfiles: getStatus.failure(action.payload),
      };
    default:
      return state;
  }
};
