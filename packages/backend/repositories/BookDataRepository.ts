import { BookData } from 'book-app-shared/types/BookData';
import { HasLabelCreate } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';

import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { BookDataQueries } from '../db/queries/bookDataQueries';
import { createBookDataFromDbRow } from '../db/transformations/bookDataTransformation';
import { checkBookDataCreate } from '../checks/bookDataCheck';

import { hasLabelRepository } from './HasLabelRepository';
import { personalBookDataRepository } from './PersonalBookDataRepository';
import { reviewRepository } from './ReviewRepository';


interface BookDataRepository extends Repository {
  createBookData: CreateActionWithContext<BookData>;
  readBookDataById: ReadActionWithContext<BookData>;
  readAllBookData: ReadAllActionWithContext<BookData>;
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
        BookDataQueries.createBookData, stringifyParams(bookId, userId, publisher, yearPublished, isbn, image, format, genreId),
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
      const row = await context.transaction.executeSingleResultQuery(BookDataQueries.getBookDataById, stringifyParams(id));
      return createBookDataFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBookData: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookDataRepository.name, ErrorMethod.ReadAll);
    try {
      const rows = await context.transaction.executeQuery(BookDataQueries.getAllBookData);
      return createArrayFromDbRows(rows, createBookDataFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
