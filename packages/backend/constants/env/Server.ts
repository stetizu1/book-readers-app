import { DefaultServerEnv } from 'book-app-shared/constants/env/DefaultServerEnv';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidPort } from 'book-app-shared/helpers/validators';

import { EnvErrorMessage } from '../ErrorMessages';


const {
  SERVER_PORT,
  PORT,
} = process.env;

const validatePortEnv = (port: string | undefined): string => {
  if (isUndefined(port)) {
    return DefaultServerEnv.port;
  }
  if (!isValidPort(port)) {
    throw new Error(EnvErrorMessage.port);
  }
  return port;
};

export const ServerEnv = {
  PORT: validatePortEnv(SERVER_PORT || PORT),
};
