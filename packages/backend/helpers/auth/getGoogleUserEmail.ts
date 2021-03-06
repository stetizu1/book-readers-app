import { OAuth2Client } from 'google-auth-library';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { GoogleEnv } from '../../constants/env/Google';
import { isGoogleIdToken } from '../../types/GoogleToken';
import { ForbiddenError } from '../../types/http-errors/ForbiddenError';
import { ForbiddenErrorMessage } from '../../constants/ErrorMessages';

/**
 * Verify the Google OAuth 2.0 id_token and retrieves the e-mail associated with the id_token
 * @param idToken - Google OAuth 2.0 id_token
 */
export const getGoogleUserEmail = async (idToken: string): Promise<string> => {
  const client = new OAuth2Client(GoogleEnv.GOOGLE_CLIENT_ID);

  const loginTicket = await client.verifyIdToken({
    idToken,
    audience: GoogleEnv.GOOGLE_CLIENT_ID,
  });

  const payload = loginTicket.getPayload();
  if (isUndefined(payload) || !isGoogleIdToken(payload)) {
    throw new ForbiddenError(ForbiddenErrorMessage.invalidGoogleToken);
  }

  return payload.email;
};
