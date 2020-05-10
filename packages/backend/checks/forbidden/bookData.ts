import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { Transaction } from '../../types/transaction/Transaction';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';

import { convertDbRowToLabel } from '../../db/transformations/labelTransformation';
import { convertDbRowToBookRequest } from '../../db/transformations/bookRequestTransformation';
import { labelQueries } from '../../db/queries/labelQueries';
import { friendshipQueries } from '../../db/queries/friendshipQueries';
import { bookRequestQueries } from '../../db/queries/bookRequestQueries';
import { checkPermissionBookRequest } from './bookRequest';
import { convertDbRowToBookData } from '../../db/transformations/bookDataTransformation';
import { bookDataQueries } from '../../db/queries/bookDataQueries';


interface CheckPermissionBookData {
  create: (context: Transaction, loggedUserId: number, labelsIds: number[] | undefined) => Promise<boolean>;
  read: (context: Transaction, loggedUserId: number, bookDataId: number, userId: number | null) => Promise<boolean>;
  update: (context: Transaction, loggedUserId: number, bookDataId: number, currentUserId: number | null, newUserId: number | null | undefined) => Promise<boolean>;
  delete: (context: Transaction, loggedUserId: number, bookDataId: number, userId: number | null) => Promise<boolean>;
  isOwner: (context: Transaction, loggedUserId: number, bookDataId: number) => Promise<boolean>;
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
    const bookRequest = await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.getBookRequestByBookDataId, bookDataId);
    await checkPermissionBookRequest.read(context, loggedUserId, bookRequest);
    return true;
  },

  update: async (context, loggedUserId, bookDataId, currentUserId, newUserId) => {
    if (currentUserId === newUserId) {
      return true;
    }
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

  isOwner: async (context, loggedUserId, bookDataId) => {
    const { userId } = await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.getBookDataById, bookDataId);
    if (loggedUserId !== userId) {
      throw new ForbiddenError();
    }
    return true;
  },
};
