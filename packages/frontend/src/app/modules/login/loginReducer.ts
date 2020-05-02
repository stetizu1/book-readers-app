import { Reducer } from 'redux';

import { GoogleTokenId, JwtToken } from 'book-app-shared/types/aliases';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { getStatus, Status } from '../../constants/Status';
import { LoginActionName } from '../../constants/actionNames/login';
import { getUserIdFromToken } from '../../helpers/login/jwtToken';

import { LoginAction } from './loginAction';
import { ErrorMessage } from '../../messages/ErrorMessage';


interface LoginData {
  token: string;
  userId: string;
}

export interface LoginState {
  loginData: Status<LoginData>;
  registrationData: Status<GoogleTokenId>;
}

const initialState: LoginState = {
  loginData: getStatus.idle(),
  registrationData: getStatus.idle(),
};

const getStatusLoginSuccess = (state: LoginState, token: JwtToken): Status<LoginData> => {
  const userId = getUserIdFromToken(token);
  if (isNull(userId)) {
    return getStatus.failure(ErrorMessage.loginFailed);
  }
  return getStatus.success({ token, userId });
};

const reducer = {
  login: (state: LoginState, status: Status<LoginData>): LoginState => ({
    ...state,
    registrationData: getStatus.idle(),
    loginData: status,
  }),

  registration: (state: LoginState, status: Status<GoogleTokenId>): LoginState => ({
    ...state,
    registrationData: status,
    loginData: getStatus.idle(),
  }),
};

export const loginReducer: Reducer<LoginState, LoginAction> = (state = initialState, action) => {
  switch (action.type) {
    case LoginActionName.START_LOGIN:
      return reducer.login(state, getStatus.loading());

    case LoginActionName.LOGIN_SUCCEEDED:
      return reducer.login(state, getStatusLoginSuccess(state, action.payload));

    case LoginActionName.LOGIN_FAILED:
      return reducer.login(state, getStatus.failure(action.payload));


    case LoginActionName.START_REGISTRATION:
      return reducer.registration(state, getStatus.loading());

    case LoginActionName.REGISTRATION_SUCCEEDED:
      return reducer.registration(state, getStatus.success(action.payload));

    case LoginActionName.REGISTRATION_FAILED:
      return reducer.registration(state, getStatus.failure(action.payload));

    case LoginActionName.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
