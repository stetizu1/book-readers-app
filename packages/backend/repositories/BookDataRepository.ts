import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { BookRequest } from 'book-app-shared/types/BookRequest';
import { HasLabel } from 'book-app-shared/types/HasLabel';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ConflictErrorMessage, PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkBookDataCreate, checkBookDataUpdate } from '../checks/bookDataCheck';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import {
  composeBookDataAndLabels,
  createBookDataFromDbRow,
  transformBookDataUpdateFromBookData,
} from '../db/transformations/bookDataTransformation';

import { personalBookDataRepository } from './PersonalBookDataRepository';
import { reviewRepository } from './ReviewRepository';
import { hasLabelRepository } from './HasLabelRepository';
import { bookRequestRepository } from './BookRequestRepository';

import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { bookRequestQueries } from '../db/queries/bookRequestQueries';
import { friendshipQueries } from '../db/queries/friendshipQueries';

import { createHasLabelFromDbRow } from '../db/transformations/hasLabelTransformation';
import { createBookRequestFromDbRow } from '../db/transformations/bookRequestTransformation';


interface BookDataRepository extends Repository {
  createBookData: CreateActionWithContext<BookData>;
  readBookDataById: ReadActionWithContext<BookData | BookDataWithLabelIds>;
  readAllBookData: ReadAllActionWithContext<BookData>;
  updateBookData: UpdateActionWithContext<BookData>;
  deleteBookData: DeleteActionWithContext<BookData>;
}

export const bookDataRepository: BookDataRepository = {
  name: RepositoryName.bookData,

  createBookData: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookDataRepository.name, body);
    const checked = checkBookDataCreate(body, errPrefix, errPostfix);

    const createBookData = async (): Promise<BookData> => {
      const {
        bookId, publisher, yearPublished, isbn, image, format, genreId,
      } = checked;
      try {
        return await context.executeSingleResultQuery(
          createBookDataFromDbRow, bookDataQueries.createBookData, bookId, loggedUserId, publisher, yearPublished, isbn, image, format, genreId,
        );
      } catch (error) {
        return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
      }
    };

    const createdBookData = await createBookData();
    const bookDataId = createdBookData.id;
    const {
      labelsIds, personalBookData, review,
    } = checked;

    if (!isUndefined(labelsIds)) {
      await Promise.all(
        labelsIds.map((labelId) => {
          const hasLabel: HasLabel = { bookDataId, labelId };
          return hasLabelRepository.createHasLabel(context, loggedUserId, hasLabel);
        }),
      );
    }

    if (!isUndefined(personalBookData)) {
      await personalBookDataRepository.createPersonalBookData(context, loggedUserId, {
        ...personalBookData,
        bookDataId,
      });
    }

    if (!isUndefined(review)) {
      await reviewRepository.createReview(context, loggedUserId, {
        ...review,
        bookDataId,
      });
    }

    return createdBookData;
  },

  readBookDataById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookDataRepository.name, id);
    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      const bookData = await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.getBookDataById, id);
      const { userId } = bookData;

      if (loggedUserId === userId) {
        const hasLabels = await context.executeQuery(createHasLabelFromDbRow, hasLabelQueries.getHasLabelsByBookDataId, bookData.id);
        return composeBookDataAndLabels(bookData, hasLabels);
      }

      // otherwise check permission
      if (!isNull(userId)) {
        await context.executeCheck(friendshipQueries.getConfirmedFriendshipByIds, loggedUserId, id); // one of friends
      } else {
        await bookRequestRepository.readBookRequestByBookDataId(context, loggedUserId, id); // permission in connected book request
      }

      return bookData;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookData: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookDataRepository.name);
    try {
      return await context.executeQuery(createBookDataFromDbRow, bookDataQueries.getAllBookData, loggedUserId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookData: async (context, loggedUserId, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookDataRepository.name, id, body);

    const checked = checkBookDataUpdate(body, errPrefix, errPostfix);

    try {
      const current = await bookDataRepository.readBookDataById(context, loggedUserId, id);
      const currentData = transformBookDataUpdateFromBookData(current);
      const mergedUpdateData = merge(currentData, checked);
      const {
        userId, publisher, yearPublished, isbn, image, format, genreId,
      } = mergedUpdateData;

      if (!isUndefined(checked.userId)) {
        if (checked.userId !== loggedUserId) {
          return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
        }
        if (!isNull(current.userId)) {
          return Promise.reject(getHttpError.getInvalidParametersError(ConflictErrorMessage.bookDataUserExists, errPrefix, errPostfix));
        }
        const deleteBookRequest = async (): Promise<BookRequest> => {
          try {
            const bookRequest = await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, id);
            if ((bookRequest.createdByBookingUser && bookRequest.userBookingId !== loggedUserId)
              || (!bookRequest.createdByBookingUser && bookRequest.userId !== loggedUserId)) {
              return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
            }
            return await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, id);
          } catch (error) {
            return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
          }
        };
        await deleteBookRequest();
      }

      const newLabels = checked.labelsIds;
      if (newLabels) {
        await Promise.all(
          newLabels
            .filter((labelId) => !currentData.labelsIds.includes(labelId))
            .map(async (labelId) => (
              context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.createHasLabel, id, labelId)
            )),
        );
        await Promise.all(
          currentData.labelsIds
            .filter((labelId) => !newLabels.includes(labelId))
            .map(async (labelId) => (
              context.executeSingleResultQuery(createHasLabelFromDbRow, hasLabelQueries.deleteHasLabel, id, labelId)
            )),
        );
      }
      return await context.executeSingleResultQuery(
        createBookDataFromDbRow,
        bookDataQueries.updateBookData,
        id, userId, publisher, yearPublished, isbn, image, format, genreId,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  deleteBookData: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(bookDataRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      const existing = await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.getBookDataById, id);
      if (!isNull(existing.userId) && existing.userId === loggedUserId) {
        return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
      }
      if (isNull(existing.userId)) {
        const deleteBookRequest = async (): Promise<BookRequest> => {
          try {
            const bookRequest = await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, id);
            if ((bookRequest.createdByBookingUser && bookRequest.userBookingId !== loggedUserId)
              || (!bookRequest.createdByBookingUser && bookRequest.userId !== loggedUserId)) {
              return Promise.reject(getHttpError.getForbiddenError(errPrefix, errPostfix));
            }
            return await context.executeSingleResultQuery(createBookRequestFromDbRow, bookRequestQueries.deleteBookRequest, id);
          } catch (error) {
            return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
          }
        };
        await deleteBookRequest();
      }
      return await context.executeSingleResultQuery(createBookDataFromDbRow, bookDataQueries.deleteBookData, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
