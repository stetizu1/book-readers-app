import { isValidEmail } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ForbiddenMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { UnauthorizedReadActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { getGoogleUserEmail } from '../helpers/auth/getGoogleUserEmail';
import { jwtCreateForUser } from '../helpers/auth/jwtCreateForUser';
import { getHttpError } from '../helpers/errors/getHttpError';

import { userQueries } from '../db/queries/userQueries';
import { createUserFromDbRow } from '../db/transformations/userTransformation';


interface LoginRepository extends Repository {
  handleLogin: UnauthorizedReadActionWithContext<string>;
  readUserIdByEmail: UnauthorizedReadActionWithContext<number>;
}

export const authRepository: LoginRepository = {
  name: RepositoryName.auth,

  readUserIdByEmail: async (context, email) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authRepository.name, email);

    if (!isValidEmail(email)) {
      return Promise.reject(getHttpError.getInvalidParametersError(ForbiddenMessage.invalidTokenFormat, errPrefix, errPostfix));
    }

    try {
      const user = await context.executeSingleResultQuery(createUserFromDbRow, userQueries.getUserByEmail, email);
      return user.id;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  handleLogin: async (context, token) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authRepository.name, token);
    const userEmail = await getGoogleUserEmail(token);

    try {
      const userId = await authRepository.readUserIdByEmail(context, userEmail);
      return jwtCreateForUser(userId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
