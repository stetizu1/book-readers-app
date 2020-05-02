import { combineReducers, Reducer } from 'redux';
import { loginReducer, LoginState } from './login/loginReducer';
import { userReducer, UserState } from './user/userReducer';
import { LoginActionName } from '../constants/actionNames/login';

export type AppState = {
  loginState: LoginState;
  userState: UserState;
};

const appReducer: Reducer<AppState> = combineReducers({
  loginState: loginReducer,
  userState: userReducer,
});

export const rootReducer: Reducer<AppState> = (state, action) => {
  if (action.type === LoginActionName.LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
