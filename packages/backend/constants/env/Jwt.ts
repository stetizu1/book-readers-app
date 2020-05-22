import { envToStringRequired } from 'book-app-shared/helpers/envHelpers';
import { EnvErrorMessage } from '../ErrorMessages';

const {
  JWT_SECRET,
} = process.env;

export const JwtEnv = {
  JWT_SECRET: envToStringRequired(JWT_SECRET, EnvErrorMessage.jwtSecret),
};
