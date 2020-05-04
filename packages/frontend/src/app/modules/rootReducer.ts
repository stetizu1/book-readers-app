import { combineReducers, Reducer } from 'redux';
import { loginReducer, LoginState } from './login/loginReducer';
import { userReducer, UserState } from './user/userReducer';
import { LoginActionName } from '../constants/actionNames/login';
import { dialogReducer, DialogState } from './dialog/dialogReducer';

export type AppState = {
  loginState: LoginState;
  userState: UserState;
  dialogState: DialogState;
};

const appReducer: Reducer<AppState> = combineReducers({
  loginState: loginReducer,
  userState: userReducer,
  dialogState: dialogReducer,
});

export const rootReducer: Reducer<AppState> = (state, action) => {
  if (action.type === LoginActionName.LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
