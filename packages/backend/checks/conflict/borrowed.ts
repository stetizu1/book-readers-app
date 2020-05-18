import { BorrowedCreate, BorrowedUpdate } from 'book-app-shared/types/Borrowed';

import { ConflictErrorMessage } from '../../constants/ErrorMessages';

import { Transaction } from '../../types/transaction/Transaction';
import { ConflictError } from '../../types/http-errors/ConflictError';

import { convertDbRowToBookData } from '../../db/transformations/bookDataTransformation';
import { convertDbRowToBorrowed } from '../../db/transformations/borrowedTransformation';
import { bookDataQueries } from '../../db/queries/bookDataQueries';
import { borrowedQueries } from '../../db/queries/borrowedQueries';


const checkConflictBorrowCU = async (context: Transaction, loggedUserId: number, userBorrowedId: number | null | undefined, bookDataId: number): Promise<boolean> => {
  if (userBorrowedId === loggedUserId) {
    throw new ConflictError(ConflictErrorMessage.borrowSameIdGiven);
  }

  const { userId } = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
  if (userId !== loggedUserId) {
    throw new ConflictError(ConflictErrorMessage.borrowNotYourBook);
  }
  return true;
};

interface CheckConflictBorrow {
  create: (context: Transaction, loggedUserId: number, borrowed: BorrowedCreate) => Promise<boolean>;
  update: (context: Transaction, loggedUserId: number, borrowed: BorrowedUpdate, id: number) => Promise<boolean>;
  delete: (context: Transaction, loggedUserId: number, id: number) => Promise<boolean>;
}

export const checkConflictBorrowed: CheckConflictBorrow = {
  create: async (context, loggedUserId, borrowed) => (
    checkConflictBorrowCU(context, loggedUserId, borrowed.userBorrowedId, borrowed.bookDataId)
  ),

  update: async (context, loggedUserId, borrowedUpdate, id) => {
    const currentBorrowed = await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.getBorrowedById, id);
    if (currentBorrowed.returned && !borrowedUpdate.returned) {
      throw new ConflictError(ConflictErrorMessage.borrowInvalidReturned);
    }
    return checkConflictBorrowCU(context, loggedUserId, borrowedUpdate.userBorrowedId, currentBorrowed.bookDataId);
  },

  delete: async (context, loggedUserId, id) => {
    const { bookDataId } = await context.executeSingleResultQuery(convertDbRowToBorrowed, borrowedQueries.getBorrowedById, id);
    const { userId } = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
    if (userId !== loggedUserId) {
      throw new ConflictError(ConflictErrorMessage.borrowDeleteNotFromYourBook);
    }
    return true;
  },
};
