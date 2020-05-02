import { TokenPayload } from 'google-auth-library';

import {
  isBoolean,
  isNumber,
  isString,
  isStructure,
  typeCheckFactory,
  TypeCheckFunction,
} from 'book-app-shared/helpers/typeChecks';
import { UnknownType } from 'book-app-shared/types/others/UnknownType';


export interface GoogleIdToken extends TokenPayload {
  email: string;
  email_verified: boolean;
}

export const isGoogleIdToken: TypeCheckFunction<GoogleIdToken> = typeCheckFactory(
  (test): test is GoogleIdToken => (
    isStructure<UnknownType<GoogleIdToken>>(test, ['iss', 'sub', 'aud', 'iat', 'exp', 'email', 'email_verified'])
    && isString(test.iss)
    && isString(test.sub)
    && isString(test.aud)
    && isNumber(test.iat)
    && isNumber(test.exp)
    && isString(test.email)
    && isBoolean(test.email_verified)
  ),
);
