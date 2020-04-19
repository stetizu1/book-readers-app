import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { HasLabelCreate } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';
import {
  ErrorMethod,
  getErrorPrefixAndPostfix,
  INVALID_ID, BOOK_DATA_CAN_NOT_REPLACE_USER,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { bookDataQueries } from '../db/queries/bookDataQueries';
import {
  createBookDataFromDbRow,
  createBookDataWithLabelsIdsFromDbRows,
  transformBookDataUpdateFromBookData,
} from '../db/transformations/bookDataTransformation';
import { checkBookDataCreate, checkBookDataUpdate } from '../checks/bookDataCheck';

import { personalBookDataRepository } from './PersonalBookDataRepository';
import { reviewRepository } from './ReviewRepository';
import { hasLabelRepository } from './HasLabelRepository';
import { hasLabelQueries } from '../db/queries/hasLabelQueries';


interface BookDataRepository extends Repository {
  createBookData: CreateActionWithContext<BookData>;
  readBookDataById: ReadActionWithContext<BookDataWithLabelIds>;
  readAllBookData: ReadAllActionWithContext<BookData>;
  updateBookData: UpdateActionWithContext<BookData>;
}

export const bookDataRepository: BookDataRepository = {
  name: 'BookData',

  createBookData: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookDataRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBookDataCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    const {
      bookId, userId, publisher, yearPublished, isbn, image, format, genreId, labelsIds, personalBookData, review,
    } = checked;

    try {
      const bookDataRow = await context.transaction.executeSingleResultQuery(
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

  readBookDataById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookDataRepository.name, ErrorMethod.Read, id);
    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(bookDataQueries.getBookDataById, stringifyParams(id));
      const labelsRows = await context.transaction.executeQuery(hasLabelQueries.getHasLabelsByBookDataId, stringifyParams(row.id));
      return createBookDataWithLabelsIdsFromDbRows(row, labelsRows);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookData: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookDataRepository.name, ErrorMethod.ReadAll);
    try {
      const rows = await context.transaction.executeQuery(bookDataQueries.getAllBookData);
      return createArrayFromDbRows(rows, createBookDataFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateBookData: async (context, id, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookDataRepository.name, ErrorMethod.Update, id, body);

    const { checked, checkError } = checkBookDataUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await bookDataRepository.readBookDataById(context, id);
      const currentData = transformBookDataUpdateFromBookData(current);

      if (current.userId !== null && checked.userId !== undefined) {
        return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, BOOK_DATA_CAN_NOT_REPLACE_USER));
      }

      if (checked.labelsIds) {
        const newLabels = checked.labelsIds;
        const oldLabels = currentData.labelsIds;

        const addLabels = newLabels.filter((labelId) => !oldLabels.includes(labelId));
        const deleteLabels = oldLabels.filter((labelId) => !newLabels.includes(labelId));

        await Promise.all(
          addLabels.map(async (labelId) => (
            context.transaction.executeSingleResultQuery(hasLabelQueries.createHasLabel, stringifyParams(id, labelId))
          )),
        );
        await Promise.all(
          deleteLabels.map(async (labelId) => (
            context.transaction.executeSingleOrNoResultQuery(hasLabelQueries.deleteHasLabel, stringifyParams(id, labelId))
          )),
        );
      }

      const mergedUpdateData = merge(currentData, checked);

      const {
        userId, publisher, yearPublished, isbn, image, format, genreId,
      } = mergedUpdateData;

      const row = await context.transaction.executeSingleResultQuery(
        bookDataQueries.updateBookData,
        stringifyParams(id, userId, publisher, yearPublished, isbn, image, format, genreId),
      );

      return createBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
