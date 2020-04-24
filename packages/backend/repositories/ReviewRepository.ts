import { Review } from 'book-app-shared/types/Review';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { PathErrorMessage } from '../constants/ErrorMessages';
import { RepositoryName } from '../constants/RepositoryName';

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
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';
import { merge } from '../helpers/db/merge';

import { checkReviewCreate, checkReviewUpdate } from '../checks/reviewCheck';
import { reviewQueries } from '../db/queries/reviewQueries';
import { createReviewFromDbRow, transformReviewUpdateFromReview } from '../db/transformations/reviewTransformation';


interface ReviewRepository extends Repository {
  createReview: CreateActionWithContext<Review>;
  readReviewByBookDataId: ReadActionWithContext<Review>;
  readAllReviews: ReadAllActionWithContext<Review>;
  updateReview: UpdateActionWithContext<Review>;
  deleteReview: DeleteActionWithContext<Review>;
}

export const reviewRepository: ReviewRepository = {
  name: RepositoryName.review,

  createReview: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(reviewRepository.name, body);

    const { checked, checkError } = checkReviewCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const row = await context.executeSingleResultQuery(reviewQueries.createReview, checked.bookDataId, checked.stars, checked.comment);
      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readReviewByBookDataId: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(reviewRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(reviewQueries.getReviewByBookDataId, bookDataId);
      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllReviews: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(reviewRepository.name);

    try {
      const rows = await context.executeQuery(reviewQueries.getAllReviews);
      return createArrayFromDbRows(rows, createReviewFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateReview: async (context, loggedUserId, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(reviewRepository.name, bookDataId, body);

    const { checked, checkError } = checkReviewUpdate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const current = await reviewRepository.readReviewByBookDataId(context, loggedUserId, bookDataId);
      const currentData = transformReviewUpdateFromReview(current);
      const mergedUpdateData = merge(currentData, checked);

      const { comment, stars } = mergedUpdateData;

      if (isNull(comment) && isNull(stars)) {
        await context.executeSingleResultQuery(
          reviewQueries.deleteReview,
          bookDataId,
        );
        return createReviewFromDbRow({});
      }

      const row = await context.executeSingleResultQuery(
        reviewQueries.updateReview,
        bookDataId, stars, comment,
      );

      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
  deleteReview: async (context, loggedUserId, bookDataId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(reviewRepository.name, bookDataId);

    if (!isValidId(bookDataId)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(reviewQueries.deleteReview, bookDataId);
      return createReviewFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
