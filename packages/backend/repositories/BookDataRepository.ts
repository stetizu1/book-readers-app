import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { HasLabelCreate } from 'book-app-shared/types/HasLabel';
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
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkBookDataCreate, checkBookDataCreateFromBookRequest, checkBookDataUpdate } from '../checks/bookDataCheck';
import { bookDataQueries } from '../db/queries/bookDataQueries';
import {
  createBookDataFromDbRow,
  createBookDataWithLabelsIdsFromDbRows,
  transformBookDataUpdateFromBookData,
} from '../db/transformations/bookDataTransformation';

import { hasLabelQueries } from '../db/queries/hasLabelQueries';
import { personalBookDataRepository } from './PersonalBookDataRepository';
import { reviewRepository } from './ReviewRepository';
import { hasLabelRepository } from './HasLabelRepository';


interface BookDataRepository extends Repository {
  createBookData: CreateActionWithContext<BookData>;
  createBookDataFromRequest: CreateActionWithContext<BookData>;
  readBookDataById: ReadActionWithContext<BookDataWithLabelIds>;
  readAllBookData: ReadAllActionWithContext<BookData>;
  updateBookData: UpdateActionWithContext<BookData>;
}

export const bookDataRepository: BookDataRepository = {
  name: RepositoryName.bookData,

  createBookData: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookDataRepository.name, body);

    const { checked, checkError } = checkBookDataCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const {
      bookId, userId, publisher, yearPublished, isbn, image, format, genreId, labelsIds, personalBookData, review,
    } = checked;

    try {
      const bookDataRow = await context.executeSingleResultQuery(
        bookDataQueries.createBookData, stringifyParams(bookId, userId, publisher, yearPublished, isbn, image, format, genreId),
      );
      const createdBookData = createBookDataFromDbRow(bookDataRow);
      const bookDataId = createdBookData.id;

      if (labelsIds) {
        await Promise.all(
          labelsIds.map((labelId) => {
            const hasLabel: HasLabelCreate = { bookDataId, labelId };
            return hasLabelRepository.createHasLabel(context, hasLabel);
          }),
        );
      }

      if (personalBookData) {
        await personalBookDataRepository.createPersonalBookData(context, { ...personalBookData, bookDataId });
      }

      if (review) {
        await reviewRepository.createReview(context, { ...review, bookDataId });
      }

      return createdBookData;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  createBookDataFromRequest: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookDataRepository.name, body);

    const { checked, checkError } = checkBookDataCreateFromBookRequest(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const {
      bookId, publisher, yearPublished, isbn, image, format, genreId,
    } = checked;
    const userId = null;

    try {
      const bookDataRow = await context.executeSingleResultQuery(
        bookDataQueries.createBookData, stringifyParams(bookId, userId, publisher, yearPublished, isbn, image, format, genreId),
      );
      return createBookDataFromDbRow(bookDataRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookDataById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookDataRepository.name, id);
    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(bookDataQueries.getBookDataById, stringifyParams(id));
      const labelsRows = await context.executeQuery(hasLabelQueries.getHasLabelsByBookDataId, stringifyParams(row.id));
      return createBookDataWithLabelsIdsFromDbRows(row, labelsRows);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookData: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookDataRepository.name);
    try {
      const rows = await context.executeQuery(bookDataQueries.getAllBookData);
      return createArrayFromDbRows(rows, createBookDataFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookData: async (context, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(bookDataRepository.name, id, body);

    const { checked, checkError } = checkBookDataUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await bookDataRepository.readBookDataById(context, id);
      const currentData = transformBookDataUpdateFromBookData(current);

      if (!isUndefined(checked.userId)) {
        if (!isNull(current.userId)) {
          return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, ConflictErrorMessage.bookDataUserExists));
        }
        // todo delete request
      }

      if (checked.labelsIds) {
        const newLabels = checked.labelsIds;
        const oldLabels = currentData.labelsIds;

        const addLabels = newLabels.filter((labelId) => !oldLabels.includes(labelId));
        const deleteLabels = oldLabels.filter((labelId) => !newLabels.includes(labelId));

        await Promise.all(
          addLabels.map(async (labelId) => (
            context.executeSingleResultQuery(hasLabelQueries.createHasLabel, stringifyParams(id, labelId))
          )),
        );
        await Promise.all(
          deleteLabels.map(async (labelId) => (
            context.executeSingleOrNoResultQuery(hasLabelQueries.deleteHasLabel, stringifyParams(id, labelId))
          )),
        );
      }

      // todo you can only add your userId

      const mergedUpdateData = merge(currentData, checked);

      const {
        userId, publisher, yearPublished, isbn, image, format, genreId,
      } = mergedUpdateData;


      const row = await context.executeSingleResultQuery(
        bookDataQueries.updateBookData,
        stringifyParams(id, userId, publisher, yearPublished, isbn, image, format, genreId),
      );

      return createBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
