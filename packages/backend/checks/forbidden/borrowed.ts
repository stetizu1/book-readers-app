import { Borrowed, BorrowedCreate, BorrowedUpdate } from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { Transaction } from '../../types/transaction/Transaction';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';

import { convertDbRowToBookData } from '../../db/transformations/bookDataTransformation';
import { bookDataQueries } from '../../db/queries/bookDataQueries';
import { friendshipQueries } from '../../db/queries/friendshipQueries';


export const checkPermissionBorrowCU = async (context: Transaction, loggedUserId: number, userBorrowedId: number | null | undefined): Promise<boolean> => {
  if (!isUndefined.or(isNull)(userBorrowedId)) {
    const isFriend = await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userBorrowedId);
    if (!isFriend) {
      throw new ForbiddenError();
    }
  }
  return true;
};

interface CheckPermissionBorrowed {
  create: (context: Transaction, loggedUserId: number, borrowedCreate: BorrowedCreate) => Promise<boolean>;
  update: (context: Transaction, loggedUserId: number, borrowedUpdate: BorrowedUpdate) => Promise<boolean>;
  read: (context: Transaction, loggedUserId: number, bookDataId: number, borrowed: Borrowed) => Promise<boolean>;
}


export const checkPermissionBorrowed: CheckPermissionBorrowed = {
  create: async (context, loggedUserId, borrowedCreate) => (
    checkPermissionBorrowCU(context, loggedUserId, borrowedCreate.userBorrowedId)
  ),

  update: async (context, loggedUserId, borrowedUpdate) => (
    checkPermissionBorrowCU(context, loggedUserId, borrowedUpdate.userBorrowedId)
  ),

  read: async (context, loggedUserId, bookDataId, borrowed) => {
    const bookData = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
    if (bookData.id !== loggedUserId && borrowed.userBorrowedId !== loggedUserId) {
      throw new ForbiddenError();
    }
    return true;
  },
};
