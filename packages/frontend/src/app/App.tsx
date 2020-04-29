import React from 'react';
import '../App.css';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GoogleEnv } from './constants/env/Google';

require('dotenv').config();

/**
 * Dummy frontend to to get response on google token
 * @param response
 */
function onSignIn(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
  if ('code' in response) {
    return;
  }

  const token = response.getAuthResponse().id_token;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:3001/api/login/${token}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    console.log('Token:', xhr.responseText);
  };
  xhr.send();
}

const cookiePolicy = 'single_host_origin';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GoogleLogin
          clientId={GoogleEnv.GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={onSignIn}
          onFailure={() => {
          }}
          cookiePolicy={cookiePolicy}
        />
      </header>
    </div>
  );
}

export default App;
