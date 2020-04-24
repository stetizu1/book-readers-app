import { stringToBoolean } from 'book-app-shared/helpers/tsHelpers';

const {
  DATABASE_URL = '',
  SSL = '',
} = process.env;

export const DbEnv = {
  DATABASE_URL,
  SSL: stringToBoolean(SSL),
};
