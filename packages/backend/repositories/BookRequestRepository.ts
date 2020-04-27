import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext, DeleteActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkBookRequestCreate, checkBookRequestUpdate } from '../checks/body/bookRequest';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import {
  convertDbRowToBookRequest,
  convertBookRequestToBookRequestUpdate,
} from '../db/transformations/bookRequestTransformation';

import { checkBookDataCreateFromBookRequest } from '../checks/body/bookData';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import { friendshipQueries } from '../db/queries/friendshipQueries';
import { convertDbRowToBookData } from '../db/transformations/bookDataTransformation';
import { ForbiddenError } from '../types/http_errors/ForbiddenError';
import { checkParameterId } from '../checks/parameter/checkParameterId';


interface BookRequestRepository extends Repository {
  createBookRequestWithBookData: CreateActionWithContext<BookRequest>;
  readBookRequestByBookDataId: ReadActionWithContext<BookRequest>;
  readAllBookRequests: ReadAllActionWithContext<BookRequest>;
  updateBookRequest: UpdateActionWithContext<BookRequest>;
  deleteBookRequest: DeleteActionWithContext<BookRequest>;
}

export const bookRequestRepository: BookRequestRepository = {
  name: RepositoryName.bookRequest,

  createBookRequestWithBookData: async (context, loggedUserId, body) => {
    try {
      const bookRequestCreate = checkBookRequestCreate(body);
      const {
        userId, userBookingId, comment, createdByBookingUser,
      } = bookRequestCreate;

      if (bookRequestCreate.createdByBookingUser) {
        if ((await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, userId, userBookingId))
          || bookRequestCreate.userBookingId !== loggedUserId
        ) {
          throw new ForbiddenError();
        }
        // you can only create request for your friends
      } else if (bookRequestCreate.userId !== loggedUserId) {
        throw new ForbiddenError();
      }

      const bookDataCreate = checkBookDataCreateFromBookRequest(bookRequestCreate.bookData);
      const bookData = await context.executeSingleResultQuery(
        convertDbRowToBookData,
        bookDataQueries.createBookData,
        bookDataCreate.bookId, null, bookDataCreate.publisher,
        bookDataCreate.yearPublished, bookDataCreate.isbn, bookDataCreate.image,
        bookDataCreate.format, bookDataCreate.genreId,
      );

      return await context.executeSingleResultQuery(
        convertDbRowToBookRequest,
        bookRequestQueries.createBookRequest,
        bookData.id, userId, userBookingId, comment, createdByBookingUser,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRequestRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookRequestByBookDataId: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      const bookRequest = await context.executeSingleResultQuery(
        convertDbRowToBookRequest,
        bookRequestQueries.getBookRequestByBookDataId, bookDataId,
      );
      const { createdByBookingUser, userId } = bookRequest;
      if (userId === loggedUserId && !createdByBookingUser) {
        throw new ForbiddenError();
      }
      const isFriend = await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userId); // one of friends
      if (!isFriend) {
        throw new ForbiddenError();
      }
      return bookRequest;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRequestRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookRequests: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToBookRequest, bookRequestQueries.getAllBookRequests, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRequestRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookRequest: async (context, loggedUserId, bookDataId, body) => {
    try {
      checkParameterId(bookDataId);
      const bookRequestUpdate = checkBookRequestUpdate(body);
      const current = await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, bookDataId);
      const { userId } = current;

      if (!current.createdByBookingUser && userId === loggedUserId) {
        // if it is your request, you can only update comment
        if (!isUndefined(bookRequestUpdate.userBookingId) || !isUndefined(bookRequestUpdate.createdByBookingUser)) {
          throw new ForbiddenError();
        }
      } else if (!current.createdByBookingUser && current.userBookingId === loggedUserId) {
        // if you are logged in as userBookingId, and it is not createdByUserBooking you only can add or delete yourself
        if (!isUndefined(bookRequestUpdate.createdByBookingUser) || !isUndefined(bookRequestUpdate.comment)
          || (!isNull(bookRequestUpdate.userBookingId) && (bookRequestUpdate.userBookingId !== loggedUserId))) {
          throw new ForbiddenError();
        }
      } else if (current.createdByBookingUser && current.userBookingId === loggedUserId) {
        // if you are logged in as userBookingId, and it is createdByUserBooking you only update comment or set createdByBookingUser to false to set visible to user
        if (!isUndefined(bookRequestUpdate.userBookingId)) {
          throw new ForbiddenError();
        }
      } else {
        throw new ForbiddenError();
      }

      const currentData = convertBookRequestToBookRequestUpdate(current);
      const mergedUpdateData = merge(currentData, bookRequestUpdate);

      const { userBookingId, comment } = mergedUpdateData;
      return await context.executeSingleResultQuery(
        convertDbRowToBookRequest,
        bookRequestQueries.updateBookRequest, bookDataId, userBookingId, comment,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookRequestRepository.name, bookDataId, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookRequest: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      const currentBookRequest = await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.getBookRequestByBookDataId, bookDataId);
      if ((currentBookRequest.createdByBookingUser && currentBookRequest.userBookingId !== loggedUserId)
        || (!currentBookRequest.createdByBookingUser && currentBookRequest.userId !== loggedUserId)) {
        throw new ForbiddenError();
      }
      // delete book data too
      await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.deleteBookData, bookDataId);
      return await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.deleteBookRequest, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookRequestRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
