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


const getToken = (response: GoogleLoginResponse | GoogleLoginResponseOffline): string | undefined => {
  if ('code' in response) {
    // GoogleLoginResponseOffline
    console.error(response.code);
    return undefined;
  }

  return response.getAuthResponse().id_token;
};

interface StateProps {
  loading: boolean;
  userId?: string;
  error?: string;
}

interface DispatchProps {
  startLogin: (googleTokenId: string) => void;
  logout: () => void;
}

type Props = StateProps & DispatchProps;

const BaseLogin: FunctionComponent<Props> = (props) => {
  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    const token = getToken(response);
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
      {props.loading && <div>Loading</div>}
      {props.error && (
        <div>
          {`Error: ${props.error}`}
        </div>
      )}

      {isUndefined(props.userId) ? (
        <GoogleLogin
          clientId={GoogleEnv.GOOGLE_CLIENT_ID}
          buttonText={ButtonMessage.LoginButtonText}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={PolicyEnv.COOKIE_POLICY}
        />
      ) : (
        <div>
          {props.userId}
          <button type="button" onClick={(): void => props.logout()}>Logout</button>
        </div>
      )}
    </>

  );
};

export const Login = connect(
  (state: AppState): StateProps => ({
    loading: loginSelector.isLoading(state),
    userId: loginSelector.getLoggedUserId(state),
    error: loginSelector.getLoginError(state),
  }),
  (dispatch): DispatchProps => (
    bindActionCreators({
      startLogin: loginAction.startLogin,
      logout: loginAction.logout,
    }, dispatch)
  ),
)(BaseLogin);
