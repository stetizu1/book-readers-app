import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import { UnauthorizedReadActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { getGoogleUserEmail } from '../helpers/auth/getGoogleUserEmail';
import { jwtCreateForUser } from '../helpers/auth/jwtCreateForUser';

import { authCheckValidEmail } from '../checks/parameter/authCheckValidEmail';
import { convertDbRowToUser } from '../db/transformations/userTransformation';
import { userQueries } from '../db/queries/userQueries';


interface LoginRepository extends Repository {
  handleLogin: UnauthorizedReadActionWithContext<string>;
}

export const authRepository: LoginRepository = {
  name: RepositoryName.auth,

  handleLogin: async (context, token) => {
    try {
      const userEmail = await getGoogleUserEmail(token);
      authCheckValidEmail(userEmail);

      const user = await context.executeSingleResultQuery(
        convertDbRowToUser, userQueries.getUserByEmail, userEmail.toLowerCase(),
      );

      return jwtCreateForUser(user.id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authRepository.name, token);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
