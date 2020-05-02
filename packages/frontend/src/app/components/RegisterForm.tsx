import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { UserCreate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from '../constants/env/Google';
import { PolicyEnv } from '../constants/env/Policy';
import { isStatus, PlainStatus } from '../constants/Status';
import { ButtonMessage } from '../messages/ButtonMessage';
import { getGoogleUserEmail, getGoogleIdToken } from '../helpers/login/googleLoginResponse';
import { AppState } from '../modules/rootReducer';
import { loginSelector } from '../modules/login/loginSelector';
import { loginAction } from '../modules/login/loginAction';

interface StateProps {
  registrationStatus: PlainStatus;
}

interface DispatchProps {
  startRegistration: typeof loginAction.startRegistration;
}

type Props = StateProps & DispatchProps;

const BaseRegisterForm: FunctionComponent<Props> = (props) => {
  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    const googleToken = getGoogleIdToken(response);
    const email = getGoogleUserEmail(response);
    if (isUndefined(googleToken) || isUndefined(email)) {
      // TODO: process somehow
      return;
    }

    const newUser: UserCreate = {
      email,
      googleToken,
      publicProfile: true,
    };

    props.startRegistration(newUser);
  };

  const onFailure = (): void => {
    // TODO: process somehow
  };

  return (
    <>
      {isStatus.loading(props.registrationStatus) && <div>Loading</div>}

      <GoogleLogin
        clientId={GoogleEnv.GOOGLE_CLIENT_ID}
        buttonText={ButtonMessage.RegisterText}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={PolicyEnv.COOKIE_POLICY}
      />
    </>

  );
};

export const RegisterForm = connect(
  (state: AppState): StateProps => ({
    registrationStatus: loginSelector.getRegistrationStatus(state),
  }),
  (dispatch): DispatchProps => (
    bindActionCreators({
      startRegistration: loginAction.startRegistration,
    }, dispatch)
  ),
)(BaseRegisterForm);
