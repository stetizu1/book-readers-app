import { Review } from 'book-app-shared/types/Review';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';

import { reviewQueries } from '../db/queries/reviewQueries';
import { createReviewFromDbRow } from '../db/transformations/reviewTransformation';
import { checkReviewCreate } from '../checks/reviewCheck';


interface ReviewRepository extends Repository {
  createReview: CreateActionWithContext<Review>;
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
};
