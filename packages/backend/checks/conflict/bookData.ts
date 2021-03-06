import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ConflictErrorMessage } from '../../constants/ErrorMessages';

import { Transaction } from '../../types/transaction/Transaction';
import { ConflictError } from '../../types/http-errors/ConflictError';


interface CheckConflictBookData {
  update: (context: Transaction, loggedUserId: number, newUserId: number | undefined | null, currentUserId: number | null) => Promise<boolean>;
}

export const checkConflictBookData: CheckConflictBookData = {
  update: async (context, loggedUserId, newUserId, currentUserId) => {
    if (isNull(newUserId) && !isNull(currentUserId)) { // user can be null in database, but can not be set as a null
      throw new ConflictError(ConflictErrorMessage.bookDataCanNotDeleteUser);
    }
    if (!isUndefined(newUserId)) {
      if (!isNull(currentUserId) && currentUserId !== newUserId) {
        throw new ConflictError(ConflictErrorMessage.bookDataUserExists);
      }
    }
    return true;
  },
};
