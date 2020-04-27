import { BookRequest, BookRequestCreate, BookRequestUpdate } from 'book-app-shared/types/BookRequest';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { someOfValuesPresent } from 'book-app-shared/helpers/tsHelpers';

import { ForbiddenError } from '../../types/http_errors/ForbiddenError';
import { Transaction } from '../../types/transaction/Transaction';

import { friendshipQueries } from '../../db/queries/friendshipQueries';
import { convertDbRowToBookRequest } from '../../db/transformations/bookRequestTransformation';
import { bookRequestQueries } from '../../db/queries/bookRequestQueries';


export const checkPermissionBookRequestCreate = async (context: Transaction, loggedUserId: number, bookRequestCreate: BookRequestCreate): Promise<boolean> => {
  const { createdByBookingUser, userId, userBookingId } = bookRequestCreate;

  const isFriends = await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, userId, userBookingId);
  if (!isFriends) {
    throw new ForbiddenError();
  }
  if (createdByBookingUser) {
    if (bookRequestCreate.userBookingId !== loggedUserId) {
      throw new ForbiddenError();
    }
    return true;
  }

  if (bookRequestCreate.userId !== loggedUserId) {
    throw new ForbiddenError();
  }
  return true;
};

export const checkPermissionBookRequestRead = async (context: Transaction, loggedUserId: number, bookRequest: BookRequest): Promise<boolean> => {
  const { userId, createdByBookingUser } = bookRequest;
  if (!createdByBookingUser && userId === loggedUserId) {
    return true;
  }
  const isFriend = await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userId); // one of friends
  if (!isFriend) {
    throw new ForbiddenError();
  }
  return true;
};

export const checkPermissionBookRequestUpdate = async (context: Transaction, loggedUserId: number, bookRequestUpdate: BookRequestUpdate, bookRequestCurrent: BookRequest): Promise<boolean> => {
  const { userBookingId, createdByBookingUser, comment } = bookRequestUpdate;

  if (!bookRequestCurrent.createdByBookingUser) {
    // if it is your request, you can only update comment
    if (bookRequestCurrent.userId === loggedUserId) {
      if (someOfValuesPresent(userBookingId, createdByBookingUser)) {
        throw new ForbiddenError();
      }
      return true;
    }

    // if you are logged in as userBookingId, you can delete yourself
    if (bookRequestCurrent.userBookingId === loggedUserId) {
      if (!isNull(userBookingId) || someOfValuesPresent(createdByBookingUser, comment)) {
        throw new ForbiddenError();
      }
      return true;
    }

    // if there is none userBooking, you can add yourself
    if (isNull(bookRequestCurrent.userBookingId)) {
      if ((userBookingId !== loggedUserId) || someOfValuesPresent(createdByBookingUser, comment)) {
        throw new ForbiddenError();
      }
      return true;
    }
  }
  // created by booking user

  // if you are not booking user, you can not edit request
  if (bookRequestCurrent.userBookingId !== loggedUserId) {
    throw new ForbiddenError();
  }
  // if you are logged in as userBookingId, you can update comment or set createdByBookingUser to false to set it visible to user
  if (someOfValuesPresent(bookRequestUpdate.userBookingId)) {
    throw new ForbiddenError();
  }
  return true;
};

export const checkPermissionBookRequestDelete = async (context: Transaction, loggedUserId: number, bookDataId: number): Promise<boolean> => {
  const { createdByBookingUser, userId, userBookingId } = await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.getBookRequestByBookDataId, bookDataId);
  if (createdByBookingUser) {
    if (userBookingId !== loggedUserId) {
      throw new ForbiddenError();
    }
    return true;
  }
  if (userId !== loggedUserId) {
    throw new ForbiddenError();
  }
  return true;
};
