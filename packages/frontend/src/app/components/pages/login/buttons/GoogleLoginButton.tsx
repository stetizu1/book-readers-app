import React, { FC } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from 'app/constants/env/Google';
import { PolicyEnv } from 'app/constants/env/Policy';

import { ButtonMessage } from 'app/messages/ButtonMessage';
import { ErrorMessage } from 'app/messages/ErrorMessage';

import { getGoogleIdToken } from 'app/helpers/login/googleLoginResponse';

import { loginAction } from 'app/modules/login/loginAction';
import { loginSelector } from 'app/modules/login/loginSelector';

import { withLoading } from 'app/components/helpers/withLoading';


interface DispatchProps {
  startLogin: typeof loginAction.startLogin;
  failLogin: typeof loginAction.loginFailed;
}

type Props = DispatchProps;

const BaseLogin: FC<Props> = (props) => {
  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    const token = getGoogleIdToken(response);
    if (isUndefined(token)) {
      props.failLogin(ErrorMessage.offline);
      return;
    }

    props.startLogin(token);
  };

  const onFailure = (): void => {
    props.failLogin(ErrorMessage.googleLoginFailed);
  };

  return (
    <GoogleLogin
      clientId={GoogleEnv.GOOGLE_CLIENT_ID}
      buttonText={ButtonMessage.LoginText}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={PolicyEnv.COOKIE_POLICY}
    />
  );
};

export const GoogleLoginButton = connect(
  null,
  (dispatch): DispatchProps => (
    bindActionCreators({
      startLogin: loginAction.startLogin,
      failLogin: loginAction.loginFailed,
    }, dispatch)
  ),
)(withLoading(BaseLogin, loginSelector.getLoginStatus));
