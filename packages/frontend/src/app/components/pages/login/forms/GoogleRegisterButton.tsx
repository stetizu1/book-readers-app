import React, { FC } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { UserCreate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from 'app/constants/env/Google';
import { PolicyEnv } from 'app/constants/env/Policy';

import { ButtonMessage } from 'app/messages/ButtonMessage';
import { ErrorMessage } from 'app/messages/ErrorMessage';

import { getGoogleUserEmail, getGoogleIdToken } from 'app/helpers/login/googleLoginResponse';

import { loginSelector } from 'app/modules/login/loginSelector';
import { loginAction } from 'app/modules/login/loginAction';

import { withLoading } from 'app/components/helpers/withLoading';


interface DispatchProps {
  startRegistration: typeof loginAction.startRegistration;
  failRegistration: typeof loginAction.registrationFailed;
}

type Props = DispatchProps;

const BaseRegisterForm: FC<Props> = (props) => {
  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    const googleToken = getGoogleIdToken(response);
    const email = getGoogleUserEmail(response);
    if (isUndefined(googleToken) || isUndefined(email)) {
      props.failRegistration(ErrorMessage.offline);
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
    props.failRegistration(ErrorMessage.googleRegistrationFailed);
  };

  return (
    <GoogleLogin
      clientId={GoogleEnv.GOOGLE_CLIENT_ID}
      buttonText={ButtonMessage.RegisterText}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={PolicyEnv.COOKIE_POLICY}
    />
  );
};

export const GoogleRegisterButton = connect(
  null,
  (dispatch): DispatchProps => (
    bindActionCreators({
      startRegistration: loginAction.startRegistration,
      failRegistration: loginAction.registrationFailed,
    }, dispatch)
  ),
)(withLoading(BaseRegisterForm, loginSelector.getRegistrationStatus));
