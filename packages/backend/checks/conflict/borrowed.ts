import { BorrowedCreate, BorrowedUpdate } from 'book-app-shared/types/Borrowed';

import { ConflictErrorMessage } from '../../constants/ErrorMessages';

import { Transaction } from '../../types/transaction/Transaction';
import { ConflictError } from '../../types/http_errors/ConflictError';

import { convertDbRowToBookData } from '../../db/transformations/bookDataTransformation';
import { bookDataQueries } from '../../db/queries/bookDataQueries';


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
  update: (context: Transaction, loggedUserId: number, borrowed: BorrowedUpdate, bookDataId: number) => Promise<boolean>;
  delete: (context: Transaction, loggedUserId: number, bookDataId: number) => Promise<boolean>;
}

export const checkConflictBorrowed: CheckConflictBorrow = {
  create: async (context, loggedUserId, borrowed) => (
    checkConflictBorrowCU(context, loggedUserId, borrowed.userBorrowedId, borrowed.bookDataId)
  ),

  update: async (context, loggedUserId, borrowed, bookDataId) => (
    checkConflictBorrowCU(context, loggedUserId, borrowed.userBorrowedId, bookDataId)
  ),

  delete: async (context, loggedUserId, bookDataId) => {
    const { userId } = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
    if (userId !== loggedUserId) {
      throw new ConflictError(ConflictErrorMessage.borrowDeleteNotFromYourBook);
    }
    return true;
  },
};
