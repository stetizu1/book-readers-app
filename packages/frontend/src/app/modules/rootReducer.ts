import { combineReducers, Reducer } from 'redux';

import { AppState } from 'app/types/AppState';
import { AppActions } from 'app/types/AppActions';

import { LoginActionName } from 'app/constants/action-names/login';

import { dialogReducer } from './dialog/dialogReducer';
import { loginReducer } from './login/loginReducer';
import { userReducer } from './user/userReducer';
import { libraryReducer } from './library/libraryReducer';
import { friendshipReducer } from './friendship/friendshipReducer';


const appReducer: Reducer<AppState, AppActions> = combineReducers({
  dialogState: dialogReducer,
  loginState: loginReducer,
  userState: userReducer,
  libraryState: libraryReducer,
  friendshipState: friendshipReducer,
});

export const rootReducer: Reducer<AppState, AppActions> = (state, action) => {
  if (action.type === LoginActionName.LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
