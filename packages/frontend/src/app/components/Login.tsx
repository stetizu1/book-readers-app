import React, { FC } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from '../constants/env/Google';
import { PolicyEnv } from '../constants/env/Policy';
import { ButtonMessage } from '../messages/ButtonMessage';
import { AppState } from '../modules/rootReducer';

import { loginAction } from '../modules/login/loginAction';
import { loginSelector } from '../modules/login/loginSelector';
import { getGoogleIdToken } from '../helpers/login/googleLoginResponse';
import { isStatus, PlainStatus } from '../constants/Status';

interface StateProps {
  loginStatus: PlainStatus;
}

interface DispatchProps {
  startLogin: typeof loginAction.startLogin;
}

type Props = StateProps & DispatchProps;

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

  const loading = isStatus.loading(props.loginStatus);

  return (
    <>
      {loading && <div>Loading</div>}

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
  (state: AppState): StateProps => ({
    loginStatus: loginSelector.getLoginStatus(state),
  }),
  (dispatch): DispatchProps => (
    bindActionCreators({
      startLogin: loginAction.startLogin,
    }, dispatch)
  ),
)(BaseLogin);
