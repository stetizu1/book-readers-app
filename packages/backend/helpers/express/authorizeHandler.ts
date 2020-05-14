import { RequestHandler } from 'express';

import { ForbiddenErrorMessage } from '../../constants/ErrorMessages';
import { ForbiddenError } from '../../types/http-errors/ForbiddenError';
import { UnauthorizedReadActionWithContext } from '../../types/actionTypes';
import { executeWithContextUnauthorized } from './executeWithContext';
import { processError } from './processError';
import { jwtVerifyAndExtractUserId } from '../auth/jwtVerifyAndExtractUserId';

import { userQueries } from '../../db/queries/userQueries';
import { convertDbRowToUser } from '../../db/transformations/userTransformation';


const checkUserExists: UnauthorizedReadActionWithContext<void> = async (context, param) => {
  await context.executeSingleResultQuery(convertDbRowToUser, userQueries.getUserById, param);
};

/**
 * Express handler that verifies the JWT token provided in the authorization header, extracts
 * user id, looks up the user and assigns the id into the request structure
 * @param request
 * @param response
 * @param next
 */
export const authorizeHandler: RequestHandler = (request, response, next) => {
  try {
    const userId = jwtVerifyAndExtractUserId(request.headers.authorization);

    executeWithContextUnauthorized.read(checkUserExists)(userId)
      .then(() => {
        request.params.userId = userId;
        next();
      })
      .catch(() => processError(response, new ForbiddenError(ForbiddenErrorMessage.userDoesNotExist)));
  } catch (forbiddenError) {
    processError(response, forbiddenError);
  }
};
