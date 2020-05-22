import { envToStringWithDefault } from 'book-app-shared/helpers/envHelpers';

import { DefaultClientEnv } from 'app/constants/env/DefaultClientEnv';
import { EnvErrorMessage } from './EnvErrorMessage';


const {
  REACT_APP_COOKIE_POLICY,
} = process.env;

export const PolicyEnv = {
  COOKIE_POLICY: envToStringWithDefault(REACT_APP_COOKIE_POLICY, DefaultClientEnv.cookiePolicy, EnvErrorMessage.cookiePolicy),
};
