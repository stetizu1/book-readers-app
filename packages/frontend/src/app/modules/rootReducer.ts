import { combineReducers, Reducer } from 'redux';

import { AppState } from 'app/types/AppState';
import { AppActions } from 'app/types/AppActions';

import { LoginActionName } from 'app/constants/actionNames/login';

import { dialogReducer } from './dialog/dialogReducer';
import { loginReducer } from './login/loginReducer';
import { userReducer } from './user/userReducer';


const appReducer: Reducer<AppState, AppActions> = combineReducers({
  dialogState: dialogReducer,
  loginState: loginReducer,
  userState: userReducer,
});

export const rootReducer: Reducer<AppState, AppActions> = (state, action) => {
  if (action.type === LoginActionName.LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
