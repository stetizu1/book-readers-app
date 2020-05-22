import { verify } from 'jsonwebtoken';

import { Auth } from 'book-app-shared/constants/Authorization';
import { isString, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { JwtEnv } from '../../constants/env/Jwt';
import { ForbiddenErrorMessage } from '../../constants/ErrorMessages';
import { ForbiddenError } from '../../types/http-errors/ForbiddenError';


const checkHeaderAndGetToken = (header: string): string => {
  const parsedHeader = header.split(Auth.separator);
  if (parsedHeader.length === 2 && parsedHeader[0] === Auth.prefix) {
    return parsedHeader[1];
  }
  throw new ForbiddenError(ForbiddenErrorMessage.unknownHeaderFormat);
};

const verifyUserIdAndGetDecodedToken = (jwtToken: string): string | object => {
  try {
    return verify(jwtToken, JwtEnv.JWT_SECRET);
  } catch (error) {
    throw new ForbiddenError(ForbiddenErrorMessage.notVerified);
  }
};

const checkTokenAndGetUserId = (token: string | object): string => {
  if (isString(token) && isValidId(Number(token))) {
    return token;
  }
  throw new ForbiddenError(ForbiddenErrorMessage.invalidTokenFormat);
};

/**
 * Verifies validity of given JWT token and extracts user id
 * @param authorizationHeader - authorization header with token provided by the user during authorization
 */
export const jwtVerifyAndExtractUserId = (authorizationHeader: string | undefined): string => {
  if (isUndefined(authorizationHeader)) {
    throw new ForbiddenError(ForbiddenErrorMessage.missingAuthHeader);
  }
  const jwtToken = checkHeaderAndGetToken(authorizationHeader);
  const token = verifyUserIdAndGetDecodedToken(jwtToken);
  return checkTokenAndGetUserId(token);
};
