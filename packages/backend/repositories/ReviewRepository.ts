import { Review } from 'book-app-shared/types/Review';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';

import { ReviewQueries } from '../db/queries/ReviewQueries';
import { createReviewFromDbRow } from '../db/transformations/reviewTransformation';
import { checkReviewCreate } from '../checks/reviewCheck';


export class ReviewRepository {
  static REPO_NAME = 'Review';

  static createReview: CreateActionWithContext<Review> = async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(ReviewRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkReviewCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.transaction.executeSingleResultQuery(ReviewQueries.createReview, stringifyParams(checked.bookDataId, checked.stars, checked.comment));
      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
