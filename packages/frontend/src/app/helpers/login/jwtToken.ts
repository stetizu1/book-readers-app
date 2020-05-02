import { isString } from 'book-app-shared/helpers/typeChecks';
import { decode } from 'jsonwebtoken';

export const getUserIdFromToken = (token: string): string | null => {
  const decoded = decode(token);
  if (!isString(decoded)) {
    return null;
  }
  return decoded;
};
