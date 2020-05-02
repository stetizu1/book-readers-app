import React, { FunctionComponent } from 'react';
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
import { getErrorMessage, isStatus, PlainStatus } from '../constants/Status';

interface StateProps {
  loginStatus: PlainStatus;
  userId?: string;
}

interface DispatchProps {
  startLogin: typeof loginAction.startLogin;
  logout: typeof loginAction.logout;
}

type Props = StateProps & DispatchProps;

const BaseLogin: FunctionComponent<Props> = (props) => {
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
  const errorMessage = getErrorMessage(props.loginStatus);

  return (
    <>
      {loading && <div>Loading</div>}
      {errorMessage && (
        <div>
          {errorMessage}
        </div>
      )}

      {isUndefined(props.userId) ? (
        <GoogleLogin
          clientId={GoogleEnv.GOOGLE_CLIENT_ID}
          buttonText={ButtonMessage.LoginText}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={PolicyEnv.COOKIE_POLICY}
        />
      ) : (
        <div>
          {props.userId}
          <button
            type="button"
            onClick={(): void => {
              props.logout();
            }}
          >
            {ButtonMessage.LogoutText}
          </button>
        </div>
      )}
    </>

  );
};

export const Login = connect(
  (state: AppState): StateProps => ({
    loginStatus: loginSelector.getLoginStatus(state),
    userId: loginSelector.getLoggedUserId(state),
  }),
  (dispatch): DispatchProps => (
    bindActionCreators({
      startLogin: loginAction.startLogin,
      logout: loginAction.logout,
    }, dispatch)
  ),
)(BaseLogin);
