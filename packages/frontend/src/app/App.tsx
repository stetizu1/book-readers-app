/* eslint-disable import/first */
require('dotenv').config();

import React from 'react';
import '../App.css';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GoogleEnv } from './constants/env/Google';


/**
 * Dummy frontend to to get response on google token
 * @param response
 */
const onSignIn = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
  if ('code' in response) {
    return;
  }

  const token = response.getAuthResponse().id_token;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:3001/api/login/${token}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = (): void => {
    console.error('Token:', xhr.responseText);
  };
  xhr.send();
};

const cookiePolicy = 'single_host_origin';

export const App = (): JSX.Element => (
  <div className="App">
    <header className="App-header">
      <GoogleLogin
        clientId={GoogleEnv.GOOGLE_CLIENT_ID}
        buttonText="Login"
        onSuccess={onSignIn}
        onFailure={(): void => {
        }}
        cookiePolicy={cookiePolicy}
      />
    </header>
  </div>
);
