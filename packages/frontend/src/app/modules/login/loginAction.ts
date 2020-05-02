import { ActionType, createAction } from 'typesafe-actions';
import { LoginActionName } from '../../constants/actionNames/login';
import { ErrorMessage } from '../../messages/ErrorMessage';


export const loginAction = {
  startLogin: createAction(LoginActionName.START_LOGIN)<string>(), // Payload: googleTokenId
  loginSucceeded: createAction(LoginActionName.LOGIN_SUCCEEDED)<string>(), // Payload: jwtToken
  loginFailed: createAction(LoginActionName.LOGIN_FAILED)<ErrorMessage>(), // Payload: error message
  logout: createAction(LoginActionName.LOGOUT)(),
};

export type LoginAction = ActionType<typeof loginAction>;
