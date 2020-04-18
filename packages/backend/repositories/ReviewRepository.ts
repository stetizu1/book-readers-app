import { Review } from 'book-app-shared/types/Review';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';
import { createArrayFromDbRows } from '../db/createFromDbRow';

import { reviewQueries } from '../db/queries/reviewQueries';
import { createReviewFromDbRow } from '../db/transformations/reviewTransformation';
import { checkReviewCreate } from '../checks/reviewCheck';


interface ReviewRepository extends Repository {
  createReview: CreateActionWithContext<Review>;
  readReviewByBookDataId: ReadActionWithContext<Review>;
  readAllReviews: ReadAllActionWithContext<Review>;
}

export const reviewRepository: ReviewRepository = {
  name: 'Review',

  createReview: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(reviewRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkReviewCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(reviewQueries.createReview, stringifyParams(checked.bookDataId, checked.stars, checked.comment));
      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readReviewByBookDataId: async (context, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(reviewRepository.name, ErrorMethod.Read, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(reviewQueries.getReviewByBookDataId, stringifyParams(bookDataId));
      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllReviews: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(reviewRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(reviewQueries.getAllReviews);
      return createArrayFromDbRows(rows, createReviewFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
