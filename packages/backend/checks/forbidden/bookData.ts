import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { Transaction } from '../../types/transaction/Transaction';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';

import { convertDbRowToLabel } from '../../db/transformations/labelTransformation';
import { convertDbRowToBookRequest } from '../../db/transformations/bookRequestTransformation';
import { labelQueries } from '../../db/queries/labelQueries';
import { friendshipQueries } from '../../db/queries/friendshipQueries';
import { bookRequestQueries } from '../../db/queries/bookRequestQueries';
import { bookRequestRepository } from '../../repositories/BookRequestRepository';

// Given labels has to belong to logged user
export const checkPermissionBookDataCreate = async (context: Transaction, loggedUserId: number, labelsIds: number[] | undefined): Promise<boolean> => {
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
};

export const checkPermissionBookDataRead = async (context: Transaction, loggedUserId: number, bookDataId: number, userId: number | null): Promise<boolean> => {
  if (userId === loggedUserId) return true;
  if (!isNull(userId)) return context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userId);
  await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, bookDataId); // todo call only bookRequest read permission
  return true;
};

export const checkPermissionBookDataUpdate = async (context: Transaction, loggedUserId: number, bookDataId: number, newUserId: number | null | undefined): Promise<boolean> => {
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
};

export const checkPermissionBookDataDelete = async (context: Transaction, loggedUserId: number, bookDataId: number, userId: number | null): Promise<boolean> => {
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
};
