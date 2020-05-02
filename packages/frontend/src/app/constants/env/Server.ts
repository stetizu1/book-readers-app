import { googleClientId } from 'book-app-shared/constants/regexp';
import { envToIntegerWithDefault, envToStringWithDefault } from 'book-app-shared/helpers/envHelpers';
import { EnvErrorMessage } from '../EnvErrorMessage';
import { DefaultClientEnv, localBaseUrl } from '../DefaultClientEnv';

export const {
  REACT_APP_SERVER_BASE_URL,
  REACT_APP_TIMEOUT,
} = process.env;

export const ServerEnv = {
  SERVER_BASE_URL: envToStringWithDefault(REACT_APP_SERVER_BASE_URL, localBaseUrl, EnvErrorMessage.googleClientId, googleClientId),
  TIMEOUT: envToIntegerWithDefault(REACT_APP_TIMEOUT, DefaultClientEnv.timeout, EnvErrorMessage.timeout),
};
