import React, { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { UserCreate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from '../../../../constants/env/Google';
import { PolicyEnv } from '../../../../constants/env/Policy';

import { ButtonMessage } from '../../../../messages/ButtonMessage';

import { getGoogleUserEmail, getGoogleIdToken } from '../../../../helpers/login/googleLoginResponse';
import { withLoading } from '../../../helpers/withLoading';

import { loginSelector } from '../../../../modules/login/loginSelector';
import { loginAction } from '../../../../modules/login/loginAction';


interface DispatchProps {
  startRegistration: typeof loginAction.startRegistration;
}

type Props = DispatchProps;

const BaseRegisterForm: FC<Props> = (props) => {
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

export const RegisterGoogle = connect(
  null,
  (dispatch): DispatchProps => (
    bindActionCreators({
      startRegistration: loginAction.startRegistration,
    }, dispatch)
  ),
)(withLoading(loginSelector.getRegistrationStatus, BaseRegisterForm));