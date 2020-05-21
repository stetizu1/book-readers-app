import { envToIntegerWithDefault, envToStringWithDefault } from 'book-app-shared/helpers/envHelpers';

import { DefaultClientEnv, localBaseUrl } from 'app/constants/env/DefaultClientEnv';
import { EnvErrorMessage } from './EnvErrorMessage';


export const {
  REACT_APP_SERVER_BASE_URL,
  REACT_APP_TIMEOUT,
} = process.env;

export const ServerEnv = {
  SERVER_BASE_URL: envToStringWithDefault(REACT_APP_SERVER_BASE_URL, localBaseUrl, EnvErrorMessage.serverInvalid),
  TIMEOUT: envToIntegerWithDefault(REACT_APP_TIMEOUT, DefaultClientEnv.timeout, EnvErrorMessage.timeout),
};
