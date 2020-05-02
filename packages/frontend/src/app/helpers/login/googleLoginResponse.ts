import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

const getGoogleLoginResponse = (response: GoogleLoginResponse | GoogleLoginResponseOffline): GoogleLoginResponse | undefined => {
  if ('code' in response) { // GoogleLoginResponseOffline
    console.error(response.code);
    return undefined;
  }
  return response;
};

export const getGoogleIdToken = (response: GoogleLoginResponse | GoogleLoginResponseOffline): string | undefined => (
  getGoogleLoginResponse(response)?.getAuthResponse().id_token
);

export const getGoogleUserEmail = (response: GoogleLoginResponse | GoogleLoginResponseOffline): string | undefined => (
  getGoogleLoginResponse(response)?.profileObj.email
);
