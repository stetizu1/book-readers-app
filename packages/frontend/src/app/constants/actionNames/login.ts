enum LoginOtherActionName {
  LOGOUT = 'login/LOGOUT',
  SET_REGISTRATION_GOOGLE_DATA = 'login/SET_REGISTRATION_GOOGLE_DATA',
}

enum LoginStartActionName {
  START_LOGIN = 'login/START_LOGIN',
  START_REGISTRATION = 'login/START_REGISTRATION',
}

enum LoginSucceededActionName {
  LOGIN_SUCCEEDED = 'login/LOGIN_SUCCEEDED',
  REGISTRATION_SUCCEEDED = 'login/REGISTRATION_SUCCEEDED',
}

export enum LoginFailedActionName {
  LOGIN_FAILED = 'login/LOGIN_FAILED',
  REGISTRATION_FAILED = 'login/REGISTRATION_FAILED',
}

export const LoginActionName = {
  ...LoginStartActionName,
  ...LoginSucceededActionName,
  ...LoginFailedActionName,
  ...LoginOtherActionName,
};
