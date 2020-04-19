import { Review } from 'book-app-shared/types/Review';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../types/actionTypes';
import {
  constructDeleteMessage, getErrorPrefixAndPostfix,
  ErrorMethod,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { processTransactionError } from '../helpers/processTransactionError';
import { getHttpError } from '../helpers/getHttpError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { reviewQueries } from '../db/queries/reviewQueries';
import { createReviewFromDbRow, transformReviewUpdateFromReview } from '../db/transformations/reviewTransformation';
import { checkReviewCreate, checkReviewUpdate } from '../checks/reviewCheck';


interface ReviewRepository extends Repository {
  createReview: CreateActionWithContext<Review>;
  readReviewByBookDataId: ReadActionWithContext<Review>;
  readAllReviews: ReadAllActionWithContext<Review>;
  updateReview: UpdateActionWithContext<Review | string>;
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

  updateReview: async (context, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(reviewRepository.name, ErrorMethod.Update, bookDataId, body);

    const { checked, checkError } = checkReviewUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await reviewRepository.readReviewByBookDataId(context, bookDataId);
      const currentData = transformReviewUpdateFromReview(current);
      const mergedUpdateData = merge(currentData, checked);

      const { comment, stars } = mergedUpdateData;

      if (isNull(comment) && isNull(stars)) {
        await context.transaction.executeSingleOrNoResultQuery(
          reviewQueries.deleteReview,
          stringifyParams(bookDataId),
        );
        return constructDeleteMessage(reviewRepository.name, bookDataId);
      }

      const row = await context.transaction.executeSingleResultQuery(
        reviewQueries.updateReview,
        stringifyParams(bookDataId, stars, comment),
      );

      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
