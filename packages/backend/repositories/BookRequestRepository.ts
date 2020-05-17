import { BookRequest } from 'book-app-shared/types/BookRequest';
import { convertBookRequestToBookRequestUpdate } from 'book-app-shared/helpers/convert-to-update/bookRequest';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext, DeleteActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/string-helpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkBookRequestCreate, checkBookRequestUpdate } from '../checks/invalid/bookRequest';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import {
  convertDbRowToBookRequest,
} from '../db/transformations/bookRequestTransformation';

import { checkBookDataCreateFromBookRequest } from '../checks/invalid/bookData';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import { convertDbRowToBookData } from '../db/transformations/bookDataTransformation';
import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkPermissionBookRequest } from '../checks/forbidden/bookRequest';


interface BookRequestRepository extends Repository {
  createBookRequestWithBookData: CreateActionWithContext<BookRequest>;
  readBookRequestByBookDataId: ReadActionWithContext<BookRequest>;
  readAllBookRequests: ReadAllActionWithContext<BookRequest>;
  readAllBookedBookRequests: ReadAllActionWithContext<BookRequest>;
  updateBookRequest: UpdateActionWithContext<BookRequest>;
  deleteBookRequest: DeleteActionWithContext<BookRequest>;
}

export const bookRequestRepository: BookRequestRepository = {
  name: RepositoryName.bookRequest,

  createBookRequestWithBookData: async (context, loggedUserId, body) => {
    try {
      const bookRequestCreate = checkBookRequestCreate(body);
      await checkPermissionBookRequest.create(context, loggedUserId, bookRequestCreate);
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

  readBookRequestByBookDataId: async (context, loggedUserId, param) => {
    try {
      const bookDataId = checkParameterId(param);
      const bookRequest = await context.executeSingleResultQuery(
        convertDbRowToBookRequest,
        bookRequestQueries.getBookRequestByBookDataId, bookDataId,
      );
      await checkPermissionBookRequest.read(context, loggedUserId, bookRequest);
      return bookRequest;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRequestRepository.name, param);
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

  readAllBookedBookRequests: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToBookRequest, bookRequestQueries.getAllBookedBookRequests, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRequestRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookRequest: async (context, loggedUserId, param, body) => {
    try {
      const bookDataId = checkParameterId(param);
      const bookRequestUpdate = checkBookRequestUpdate(body);
      const current = await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, bookDataId);
      await checkPermissionBookRequest.update(context, loggedUserId, bookRequestUpdate, current);

      const currentData = convertBookRequestToBookRequestUpdate(current);
      const mergedUpdateData = merge(currentData, bookRequestUpdate);

      const { userBookingId, comment } = mergedUpdateData;
      return await context.executeSingleResultQuery(
        convertDbRowToBookRequest,
        bookRequestQueries.updateBookRequest, bookDataId, userBookingId, comment,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookRequestRepository.name, param, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookRequest: async (context, loggedUserId, param) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionBookRequest.delete(context, loggedUserId, bookDataId);

      // delete book data too
      await context.executeSingleResultQuery(convertDbRowToBookData, bookDataQueries.deleteBookData, bookDataId);
      return await context.executeSingleResultQuery(convertDbRowToBookRequest, bookRequestQueries.deleteBookRequest, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookRequestRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
