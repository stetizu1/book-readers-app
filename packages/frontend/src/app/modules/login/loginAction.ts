import { ActionType, createAction } from 'typesafe-actions';

import { UserCreate } from 'book-app-shared/types/User';
import { GoogleTokenId, JwtToken } from 'book-app-shared/types/others/aliases';

import { LoginActionName } from 'app/constants/actionNames/login';


export const loginAction = {
  startLogin: createAction(LoginActionName.START_LOGIN)<GoogleTokenId>(),
  loginSucceeded: createAction(LoginActionName.LOGIN_SUCCEEDED)<JwtToken>(),
  loginFailed: createAction(LoginActionName.LOGIN_FAILED)<string>(),

  startRegistration: createAction(LoginActionName.START_REGISTRATION)<UserCreate>(),
  registrationSucceeded: createAction(LoginActionName.REGISTRATION_SUCCEEDED)<GoogleTokenId>(),
  registrationFailed: createAction(LoginActionName.REGISTRATION_FAILED)<string>(),

  logout: createAction(LoginActionName.LOGOUT)(),
};

export type LoginAction = ActionType<typeof loginAction>;
