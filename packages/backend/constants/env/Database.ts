import { databaseUrl } from 'book-app-shared/constants/regexp';
import { envToBoolean, envToStringRequired } from 'book-app-shared/helpers/envHelpers';

import { EnvErrorMessage } from '../ErrorMessages';


const {
  DATABASE_URL,
  SSL,
} = process.env;

export const DbEnv = {
  DATABASE_URL: envToStringRequired(DATABASE_URL, EnvErrorMessage.databaseUrl, databaseUrl),
  SSL: envToBoolean(SSL, EnvErrorMessage.ssl),
};
