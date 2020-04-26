import { BookRequest } from 'book-app-shared/types/BookRequest';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext, DeleteActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkBookRequestCreate, checkBookRequestUpdate } from '../checks/bookRequestCheck';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import {
  createBookRequestFromDbRow,
  transformBookRequestUpdateFromBookRequest,
} from '../db/transformations/bookRequestTransformation';

import { checkBookDataCreateFromBookRequest } from '../checks/bookDataCheck';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import { friendshipQueries } from '../db/queries/friendshipQueries';
import { createBookDataFromDbRow } from '../db/transformations/bookDataTransformation';


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
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRequestRepository.name, body);

    const checked = checkBookRequestCreate(body, errPrefix, errPostfix);
    const {
      userId, userBookingId, comment, createdByBookingUser,
    } = checked;

    if (checked.createdByBookingUser) {
      if (checked.userBookingId !== loggedUserId) {
        return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
      }
      // you can only create request for your friends
      await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, userId, userBookingId);
    } else if (checked.userId !== loggedUserId) {
      return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
    }

    const checkedBookData = checkBookDataCreateFromBookRequest(checked.bookData, errPrefix, errPostfix);
    try {
      const bookData = await context.executeSingleResultQuery(
        createBookDataFromDbRow,
        bookDataQueries.createBookData,
        checkedBookData.bookId, null, checkedBookData.publisher,
        checkedBookData.yearPublished, checkedBookData.isbn, checkedBookData.image,
        checkedBookData.format, checkedBookData.genreId,
      );

      return await context.executeSingleResultQuery(
        createBookRequestFromDbRow,
        bookRequestQueries.createBookRequest,
        bookData.id, userId, userBookingId, comment, createdByBookingUser,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookRequestByBookDataId: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRequestRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    const findBookRequest = async (): Promise<BookRequest> => {
      try {
        return await context.executeSingleResultQuery(
          createBookRequestFromDbRow,
          bookRequestQueries.getBookRequestByBookDataId, bookDataId,
        );
      } catch (error) {
        return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
      }
    };
    const bookRequest = await findBookRequest();
    const { createdByBookingUser, userId } = bookRequest;
    if (userId === loggedUserId && !createdByBookingUser) {
      return Promise.reject(getHttpError.getNotFoundError(errPrefix, errPostfix));
    }
    await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, userId); // one of friends
    return bookRequest;
  },

  readAllBookRequests: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRequestRepository.name);

    try {
      return await context.executeQuery(createBookRequestFromDbRow, bookRequestQueries.getAllBookRequests, loggedUserId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookRequest: async (context, loggedUserId, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookRequestRepository.name, bookDataId, body);

    const checked = checkBookRequestUpdate(body, errPrefix, errPostfix);

    try {
      const current = await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, bookDataId);
      const { userId } = current;

      if (!current.createdByBookingUser && userId === loggedUserId) {
        // if it is your request, you can only update comment
        if (!isUndefined(checked.userBookingId) || !isUndefined(checked.createdByBookingUser)) {
          return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
        }
      } else if (!current.createdByBookingUser && current.userBookingId === loggedUserId) {
        // if you are logged in as userBookingId, and it is not createdByUserBooking you only can add or delete yourself
        if (!isUndefined(checked.createdByBookingUser) || !isUndefined(checked.comment)
          || (!isNull(checked.userBookingId) && (checked.userBookingId !== loggedUserId))) {
          return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
        }
      } else if (current.createdByBookingUser && current.userBookingId === loggedUserId) {
        // if you are logged in as userBookingId, and it is createdByUserBooking you only update comment or set createdByBookingUser to false to set visible to user
        if (!isUndefined(checked.userBookingId)) {
          return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
        }
      } else {
        return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
      }

      const currentData = transformBookRequestUpdateFromBookRequest(current);
      const mergedUpdateData = merge(currentData, checked);

      const { userBookingId, comment } = mergedUpdateData;
      return await context.executeSingleResultQuery(
        createBookRequestFromDbRow,
        bookRequestQueries.updateBookRequest, bookDataId, userBookingId, comment,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookRequest: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookRequestRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      const currentBookRequest = await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.getBookRequestByBookDataId, bookDataId);
      if ((currentBookRequest.createdByBookingUser && currentBookRequest.userBookingId !== loggedUserId)
        || (!currentBookRequest.createdByBookingUser && currentBookRequest.userId !== loggedUserId)) {
        return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
      }
      // delete book data too
      await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.deleteBookData, bookDataId);
      return await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
