import { RepositoryName } from '../constants/RepositoryName';
import { Repository } from '../types/repositories/Repository';
import { UnauthorizedReadActionWithContext } from '../types/actionTypes';
import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { getGoogleUserEmail } from '../helpers/auth/getGoogleUserEmail';
import { jwtCreateForUser } from '../helpers/auth/jwtCreateForUser';

import { userRepository } from './UserRepository';


interface LoginRepository extends Repository {
  handleLogin: UnauthorizedReadActionWithContext<string>;
}

export const loginRepository: LoginRepository = {
  name: RepositoryName.login,

  handleLogin: async (context, token) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(loginRepository.name, token);
    const userEmail = await getGoogleUserEmail(token);

    try {
      const user = await userRepository.readUserByEmail(context, userEmail);
      return jwtCreateForUser(user.id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
