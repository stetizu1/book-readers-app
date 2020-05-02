import { Reducer } from 'redux';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { getStatus, Status } from '../../constants/Status';
import { LoginAction } from './loginAction';
import { LoginActionName } from '../../constants/actionNames/login';
import { getUserIdFromToken } from '../../helpers/login/jwtToken';

interface LoginData {
  token: string;
  userId: string;
}

export interface LoginState {
  loginData: Status<LoginData>;
}

const initialState: LoginState = {
  loginData: getStatus.idle(),
};

const loginSuccessReducer = (state: LoginState, token: string): LoginState => {
  const userId = getUserIdFromToken(token);
  if (isNull(userId)) {
    return {
      ...state,
      loginData: getStatus.failure('Login failed'),
    }; // todo: error messages
  }

  return {
    ...state,
    loginData: getStatus.success({
      token,
      userId,
    }),
  };
};

export const loginReducer: Reducer<LoginState, LoginAction> = (state = initialState, action) => {
  switch (action.type) {
    case LoginActionName.START_LOGIN:
      return {
        ...state,
        loginData: getStatus.loading(),
      };

    case LoginActionName.LOGIN_SUCCEEDED:
      return loginSuccessReducer(state, action.payload);

    case LoginActionName.LOGIN_FAILED:
      return {
        ...state,
        loginData: getStatus.failure(action.payload),
      };

    case LoginActionName.LOGOUT:
      return {
        ...state,
        loginData: getStatus.idle(),
      };

    default:
      return state;
  }
};
