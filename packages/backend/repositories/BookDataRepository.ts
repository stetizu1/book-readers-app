import { BookData } from 'book-app-shared/types/BookData';
import { HasLabelCreate } from 'book-app-shared/types/HasLabel';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';

import { BookDataQueries } from '../db/queries/BookDataQueries';
import { createBookDataFromDbRow } from '../db/transformations/bookDataTransformation';
import { checkBookDataCreate } from '../checks/bookDataCheck';
import { processTransactionError } from '../helpers/getHttpError';
import { HasLabelRepository } from './HasLabelRepository';
import { PersonalBookDataRepository } from './PersonalBookDataRepository';
import { ReviewRepository } from './ReviewRepository';


export class BookDataRepository {
  static REPO_NAME = 'BookData';

  static createBookData: CreateActionWithContext<BookData> = async (context, body): Promise<BookData> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookDataRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

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
            return HasLabelRepository.createHasLabel(context, hasLabel);
          }),
        );
      }

      if (personalBookData) {
        await PersonalBookDataRepository.createPersonalBookData(context, { ...personalBookData, bookDataId });
      }

      if (review) {
        await ReviewRepository.createReview(context, { ...review, bookDataId });
      }

      return createdBookData;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
