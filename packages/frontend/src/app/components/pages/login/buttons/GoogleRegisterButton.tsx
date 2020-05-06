import React, { FC } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from 'app/constants/env/Google';
import { PolicyEnv } from 'app/constants/env/Policy';

import { ButtonMessage } from 'app/messages/ButtonMessage';
import { ErrorMessage } from 'app/messages/ErrorMessage';

import { getGoogleUserEmail, getGoogleIdToken } from 'app/helpers/login/googleLoginResponse';

import { loginAction } from 'app/modules/login/loginAction';

import { UnauthorizedPath } from 'app/constants/Path';
import { AppState } from 'app/types/AppState';


interface DispatchProps {
  setGoogleData: typeof loginAction.setRegistrationGoogleData;
  failRegistration: typeof loginAction.registrationFailed;
}

type Props = DispatchProps & RouteComponentProps;

const BaseRegisterForm: FC<Props> = (props) => {
  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    const token = getGoogleIdToken(response);
    const email = getGoogleUserEmail(response);
    if (isUndefined(token) || isUndefined(email)) {
      props.failRegistration(ErrorMessage.offline);
      return;
    }

    props.setGoogleData({
      token,
      email,
    });
    props.history.push(UnauthorizedPath.register);
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

export const GoogleRegisterButton = connect<{}, DispatchProps, {}, AppState>(
  null,
  {
    setGoogleData: loginAction.setRegistrationGoogleData,
    failRegistration: loginAction.registrationFailed,
  },
)(withRouter(BaseRegisterForm));
