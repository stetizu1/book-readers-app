enum LoginOtherActionName {
  LOGOUT = 'login/LOGOUT',
  SET_REGISTRATION_GOOGLE_DATA = 'login/SET_REGISTRATION_GOOGLE_DATA',
}

enum LoginStartActionName {
  START_LOGIN = 'login/START_LOGIN',
  START_REGISTRATION = 'login/START_REGISTRATION',
  START_CHECK_USER_NOT_EXISTS = 'login/START_CHECK_USER_NOT_EXISTS',
}

enum LoginSucceededActionName {
  LOGIN_SUCCEEDED = 'login/LOGIN_SUCCEEDED',
  CHECK_USER_NOT_EXISTS_SUCCEEDED = 'login/CHECK_USER_NOT_EXISTS_SUCCEEDED',
}

export enum LoginSucceedWithMessageActionName {
  REGISTRATION_SUCCEEDED = 'login/REGISTRATION_SUCCEEDED',
}

export enum LoginFailedActionName {
  LOGIN_FAILED = 'login/LOGIN_FAILED',
  REGISTRATION_FAILED = 'login/REGISTRATION_FAILED',
  CHECK_USER_NOT_EXISTS_FAILED = 'login/CHECK_USER_NOT_EXISTS_FAILED',
}

export const LoginActionName = {
  ...LoginStartActionName,
  ...LoginSucceededActionName,
  ...LoginSucceedWithMessageActionName,
  ...LoginFailedActionName,
  ...LoginOtherActionName,
};
