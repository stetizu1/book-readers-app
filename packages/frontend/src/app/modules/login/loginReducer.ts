import { Reducer } from 'redux';

import { GoogleTokenId, JwtToken } from 'book-app-shared/types/others/aliases';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { getStatus, Status } from 'app/constants/Status';
import { LoginActionName } from 'app/constants/action-names/login';
import { GoogleData } from 'app/constants/GoogleData';
import { ErrorMessage } from 'app/messages/ErrorMessage';
import { getUserIdFromJwtToken } from 'app/helpers/login/getUserIdFromJwtToken';

import { LoginAction } from './loginAction';


interface LoginData {
  token: string;
  userId: string;
}

export interface LoginState {
  loginData: Status<LoginData>;
  registrationData: Status<GoogleTokenId>;

  googleData: GoogleData | undefined;
}

const initialState: LoginState = {
  loginData: getStatus.idle(),
  registrationData: getStatus.idle(),
  googleData: undefined,
};


const getStatusLoginSuccess = (state: LoginState, token: JwtToken): Status<LoginData> => {
  const userId = getUserIdFromJwtToken(token);
  if (isNull(userId)) {
    return getStatus.failure(ErrorMessage.loginFailed);
  }
  return getStatus.success({ token, userId });
};

const reducer = {
  setLoginStatus: (state: LoginState, loginStatus: Status<LoginData>): LoginState => ({
    ...state,
    registrationData: getStatus.idle(),
    loginData: loginStatus,
    googleData: undefined,
  }),

  setRegistrationStatus: (state: LoginState, registrationStatus: Status<GoogleTokenId>): LoginState => ({
    ...state,
    registrationData: registrationStatus,
    loginData: getStatus.idle(),
    googleData: undefined,
  }),
  setGoogleToken: (state: LoginState, googleData: GoogleData | undefined): LoginState => ({
    ...state,
    googleData,
  }),
};

export const loginReducer: Reducer<LoginState, LoginAction> = (state = initialState, action) => {
  switch (action.type) {
    case LoginActionName.START_LOGIN:
      return reducer.setLoginStatus(state, getStatus.loading());

    case LoginActionName.LOGIN_SUCCEEDED:
      return reducer.setLoginStatus(state, getStatusLoginSuccess(state, action.payload));

    case LoginActionName.LOGIN_FAILED:
      return reducer.setLoginStatus(state, getStatus.failure(action.payload));


    case LoginActionName.START_REGISTRATION:
      return reducer.setRegistrationStatus(state, getStatus.loading());

    case LoginActionName.REGISTRATION_SUCCEEDED:
      return reducer.setRegistrationStatus(state, getStatus.success(action.payload.token));

    case LoginActionName.REGISTRATION_FAILED:
      return reducer.setRegistrationStatus(state, getStatus.failure(action.payload));

    case LoginActionName.SET_REGISTRATION_GOOGLE_DATA:
      return reducer.setGoogleToken(state, action.payload);

    case LoginActionName.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
