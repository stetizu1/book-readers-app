import React, { FC } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from '../../../../constants/env/Google';
import { PolicyEnv } from '../../../../constants/env/Policy';
import { ButtonMessage } from '../../../../messages/ButtonMessage';

import { loginAction } from '../../../../modules/login/loginAction';
import { loginSelector } from '../../../../modules/login/loginSelector';
import { getGoogleIdToken } from '../../../../helpers/login/googleLoginResponse';
import { withLoading } from '../../../helpers/withLoading';

interface DispatchProps {
  startLogin: typeof loginAction.startLogin;
}

type Props = DispatchProps;

const BaseLogin: FC<Props> = (props) => {
  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    const token = getGoogleIdToken(response);
    if (isUndefined(token)) {
      // TODO: process somehow
      return;
    }

    props.startLogin(token);
  };

  const onFailure = (): void => {
    // TODO: process somehow
  };

  return (
    <>
      <GoogleLogin
        clientId={GoogleEnv.GOOGLE_CLIENT_ID}
        buttonText={ButtonMessage.LoginText}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={PolicyEnv.COOKIE_POLICY}
      />
    </>

  );
};

export const Login = connect(
  null,
  (dispatch): DispatchProps => (
    bindActionCreators({
      startLogin: loginAction.startLogin,
    }, dispatch)
  ),
)(withLoading(loginSelector.getLoginStatus, BaseLogin));
