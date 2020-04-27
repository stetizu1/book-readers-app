import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ConflictErrorMessage } from '../../constants/ErrorMessages';

import { Transaction } from '../../types/transaction/Transaction';
import { ConflictError } from '../../types/http_errors/ConflictError';

export const checkConflictBookDataUpdate = async (context: Transaction, loggedUserId: number, newUserId: number | undefined | null, currentUserId: number | null): Promise<boolean> => {
  if (!isUndefined(newUserId)) { // want to change
    if (!isNull(currentUserId)) {
      throw new ConflictError(ConflictErrorMessage.bookDataUserExists);
    }
  }
  return true;
};
