import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ForbiddenErrorMessage } from '../../constants/ErrorMessages';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';
import { getGoogleUserEmail } from '../../helpers/auth/getGoogleUserEmail';
import { Transaction } from '../../types/transaction/Transaction';
import { friendshipQueries } from '../../db/queries/friendshipQueries';


interface CheckPermissionUser {
  create: (googleToken: string | undefined, email: string) => Promise<boolean>;
  read: (context: Transaction, loggedUserId: number, userId: number) => Promise<boolean>;
  update: (loggedUserId: number, userId: number) => boolean;
  delete: (loggedUserId: number, userId: number) => boolean;
}

export const checkPermissionUser: CheckPermissionUser = {
  create: async (googleToken, email) => {
    if (!isUndefined(googleToken)) {
      const userEmail = await getGoogleUserEmail(googleToken);
      if (userEmail.toLowerCase() !== email.toLowerCase()) {
        throw new ForbiddenError(ForbiddenErrorMessage.emailsNotMatch);
      }
    }
    return true;
  },

  read: async (context, loggedUserId, userId) => {
    const isFriend = await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userId);
    if (loggedUserId !== userId && !isFriend) {
      throw new ForbiddenError();
    }
    return true;
  },

  update: (loggedUserId, userId) => loggedUserId === userId,

  delete: (loggedUserId, userId) => loggedUserId === userId,
};
