import { ActionType, createAction } from 'typesafe-actions';

import { UserCreate } from 'book-app-shared/types/User';
import { GoogleTokenId, JwtToken } from 'book-app-shared/types/aliases';

import { LoginActionName } from '../../constants/actionNames/login';
import { ErrorMessage } from '../../messages/ErrorMessage';


export const loginAction = {
  startLogin: createAction(LoginActionName.START_LOGIN)<GoogleTokenId>(),
  loginSucceeded: createAction(LoginActionName.LOGIN_SUCCEEDED)<JwtToken>(),
  loginFailed: createAction(LoginActionName.LOGIN_FAILED)<ErrorMessage>(),

  startRegistration: createAction(LoginActionName.START_REGISTRATION)<UserCreate>(),
  registrationSucceeded: createAction(LoginActionName.REGISTRATION_SUCCEEDED)<GoogleTokenId>(),
  registrationFailed: createAction(LoginActionName.REGISTRATION_FAILED)<ErrorMessage>(),

  logout: createAction(LoginActionName.LOGOUT)(),
};

export type LoginAction = ActionType<typeof loginAction>;
