import { tsRegExp } from 'book-app-shared/constants/regexp';
import { envToStringRequired } from 'book-app-shared/helpers/envHelpers';

import { EnvErrorMessage } from '../ErrorMessages';


const {
  GOOGLE_CLIENT_ID,
} = process.env;

export const GoogleEnv = {
  GOOGLE_CLIENT_ID: envToStringRequired(GOOGLE_CLIENT_ID, EnvErrorMessage.googleClientId, tsRegExp.googleClientId),
};
