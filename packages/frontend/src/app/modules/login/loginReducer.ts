import { Reducer } from 'redux';
import { toast } from 'react-toastify';

import { GoogleTokenId, JwtToken } from 'book-app-shared/types/others/aliases';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { createStatus, Status } from 'app/constants/Status';
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
  registrationCheckLoading: boolean;
}

const initialState: LoginState = {
  loginData: createStatus.idle(),
  registrationData: createStatus.idle(),
  googleData: undefined,
  registrationCheckLoading: false,
};


const getStatusLogin = (state: LoginState, token: JwtToken): Status<LoginData> => {
  const userId = getUserIdFromJwtToken(token);
  if (isNull(userId)) {
    toast(ErrorMessage.loginFailed, {
      type: toast.TYPE.ERROR,
    });
    return createStatus.failure();
  }
  return createStatus.success({ token, userId });
};

const reducer = {
  setLoginStatus: (state: LoginState, loginStatus: Status<LoginData>): LoginState => ({
    ...state,
    registrationData: createStatus.idle(),
    loginData: loginStatus,
    googleData: undefined,
  }),

  setRegistrationStatus: (state: LoginState, registrationStatus: Status<GoogleTokenId>): LoginState => ({
    ...state,
    registrationData: registrationStatus,
    loginData: createStatus.idle(),
    googleData: undefined,
  }),
  setGoogleToken: (state: LoginState, googleData: GoogleData | undefined): LoginState => ({
    ...state,
    googleData,
  }),
  setRegistrationCheckLoading: (state: LoginState, registrationCheckLoading: boolean, eraseGoogleData?: boolean): LoginState => ({
    ...state,
    registrationCheckLoading,
    googleData: eraseGoogleData ? undefined : state.googleData,
  }),
};

export const loginReducer: Reducer<LoginState, LoginAction> = (state = initialState, action) => {
  switch (action.type) {
    case LoginActionName.START_LOGIN:
      return reducer.setLoginStatus(state, createStatus.loading());

    case LoginActionName.LOGIN_SUCCEEDED:
      return reducer.setLoginStatus(state, getStatusLogin(state, action.payload));

    case LoginActionName.LOGIN_FAILED:
      return reducer.setLoginStatus(state, createStatus.failure());


    case LoginActionName.START_REGISTRATION:
      return reducer.setRegistrationStatus(state, createStatus.loading());

    case LoginActionName.REGISTRATION_SUCCEEDED:
      return reducer.setRegistrationStatus(state, createStatus.success(action.payload.data.token));

    case LoginActionName.REGISTRATION_FAILED:
      return reducer.setRegistrationStatus(state, createStatus.failure());

    case LoginActionName.SET_REGISTRATION_GOOGLE_DATA:
      return reducer.setGoogleToken(state, action.payload);

    case LoginActionName.START_CHECK_USER_NOT_EXISTS:
      return reducer.setRegistrationCheckLoading(state, true);
    case LoginActionName.CHECK_USER_NOT_EXISTS_SUCCEEDED:
      return reducer.setRegistrationCheckLoading(state, false);
    case LoginActionName.CHECK_USER_NOT_EXISTS_FAILED:
      return reducer.setRegistrationCheckLoading(state, false, true);

    case LoginActionName.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
