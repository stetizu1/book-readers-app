import { RepositoryName } from '../constants/RepositoryName';
import { Repository } from '../types/repositories/Repository';
import { ReadActionWithContext, UnauthorizedReadActionWithContext } from '../types/actionTypes';
import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { getGoogleUserEmail } from '../helpers/auth/getGoogleUserEmail';
import { jwtCreateForUser } from '../helpers/auth/jwtCreateForUser';

import { userRepository } from './UserRepository';
import { friendshipQueries } from '../db/queries/friendshipQueries';


interface LoginRepository extends Repository {
  handleLogin: UnauthorizedReadActionWithContext<string>;
  isYouOrIsOneOfYourFriends: ReadActionWithContext<boolean>;
}

export const authRepository: LoginRepository = {
  name: RepositoryName.auth,

  handleLogin: async (context, token) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authRepository.name, token);
    const userEmail = await getGoogleUserEmail(token);

    try {
      const user = await userRepository.readUserByEmail(context, userEmail);
      return jwtCreateForUser(user.id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  isYouOrIsOneOfYourFriends: async (context, loggedUserId, id) => {
    if (loggedUserId === Number(id)) return true;
    await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, id);
    return true;
  },
};
