import { decode } from 'jsonwebtoken';

import { isString } from 'book-app-shared/helpers/typeChecks';
import { JwtToken } from 'book-app-shared/types/others/aliases';


export const getUserIdFromJwtToken = (token: JwtToken): string | null => {
  const decoded = decode(token);
  if (!isString(decoded)) {
    return null;
  }
  return decoded;
};
