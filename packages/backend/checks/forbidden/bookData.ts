import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { Transaction } from '../../types/transaction/Transaction';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';

import { convertDbRowToLabel } from '../../db/transformations/labelTransformation';
import { convertDbRowToBookRequest } from '../../db/transformations/bookRequestTransformation';
import { labelQueries } from '../../db/queries/labelQueries';
import { friendshipQueries } from '../../db/queries/friendshipQueries';
import { bookRequestQueries } from '../../db/queries/bookRequestQueries';
import { bookRequestRepository } from '../../repositories/BookRequestRepository';


interface CheckPermissionBookData {
  create: (context: Transaction, loggedUserId: number, labelsIds: number[] | undefined) => Promise<boolean>;
  read: (context: Transaction, loggedUserId: number, bookDataId: number, userId: number | null) => Promise<boolean>;
  update: (context: Transaction, loggedUserId: number, bookDataId: number, newUserId: number | null | undefined) => Promise<boolean>;
  delete: (context: Transaction, loggedUserId: number, bookDataId: number, userId: number | null) => Promise<boolean>;
}

export const checkPermissionBookData: CheckPermissionBookData = {
  create: async (context, loggedUserId, labelsIds) => {
    // Given labels has to belong to logged user
    if (!isUndefined(labelsIds)) {
      const labels = await Promise.all(
        labelsIds.map((labelId) => (
          context.executeSingleResultQuery(convertDbRowToLabel, labelQueries.getLabelById, labelId)
        )),
      );
      if (labels.some((label) => label.userId !== loggedUserId)) {
        throw new ForbiddenError();
      }
    }
    return true;
  },

  read: async (context, loggedUserId, bookDataId, userId) => {
    if (userId === loggedUserId) return true;
    if (!isNull(userId)) return context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userId);
    await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, bookDataId); // todo call only bookRequest read permission
    return true;
  },

  update: async (context, loggedUserId, bookDataId, newUserId) => {
    if (!isUndefined(newUserId)) {
      if (newUserId !== loggedUserId) {
        throw new ForbiddenError();
      }
      const bookRequest = await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.getBookRequestByBookDataId, bookDataId);
      if ((bookRequest.createdByBookingUser && bookRequest.userBookingId !== loggedUserId)
        || (!bookRequest.createdByBookingUser && bookRequest.userId !== loggedUserId)) {
        throw new ForbiddenError();
      }
    }
    return true;
  },

  delete: async (context, loggedUserId, bookDataId, userId) => {
    if (isNull(userId)) {
      const bookRequest = await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.getBookRequestByBookDataId, bookDataId);
      if (
        (bookRequest.createdByBookingUser && bookRequest.userBookingId !== loggedUserId)
        || (!bookRequest.createdByBookingUser && bookRequest.userId !== loggedUserId)
      ) {
        throw new ForbiddenError();
      }
      return true;
    }
    if (userId !== loggedUserId) {
      throw new ForbiddenError();
    }
    return true;
  },
};
