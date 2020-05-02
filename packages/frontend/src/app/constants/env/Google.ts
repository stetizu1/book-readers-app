import { googleClientId } from 'book-app-shared/constants/regexp';
import { envToStringRequired } from 'book-app-shared/helpers/envHelpers';

import { EnvErrorMessage } from './EnvErrorMessage';


const {
  REACT_APP_GOOGLE_CLIENT_ID,
} = process.env;

export const GoogleEnv = {
  GOOGLE_CLIENT_ID: envToStringRequired(REACT_APP_GOOGLE_CLIENT_ID, EnvErrorMessage.googleClientId, googleClientId),
};
