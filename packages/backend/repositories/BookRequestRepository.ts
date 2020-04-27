import { BookRequest } from 'book-app-shared/types/BookRequest';

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
import { convertDbRowToBookData } from '../db/transformations/bookDataTransformation';
import { checkParameterId } from '../checks/parameter/checkParameterId';
import {
  checkPermissionBookRequestCreate, checkPermissionBookRequestDelete,
  checkPermissionBookRequestRead,
  checkPermissionBookRequestUpdate,
} from '../checks/forbidden/bookRequest';


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
      await checkPermissionBookRequestCreate(context, loggedUserId, bookRequestCreate);
      const {
        userId, userBookingId, comment, createdByBookingUser,
      } = bookRequestCreate;

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
      await checkPermissionBookRequestRead(context, loggedUserId, bookRequest);
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
      await checkPermissionBookRequestUpdate(context, loggedUserId, bookRequestUpdate, current);

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
      await checkPermissionBookRequestDelete(context, loggedUserId, Number(bookDataId));

      // delete book data too
      await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.deleteBookData, bookDataId);
      return await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.deleteBookRequest, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookRequestRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
