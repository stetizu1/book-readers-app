import { Review } from 'book-app-shared/types/Review';
import { isNull } from 'book-app-shared/helpers/typeChecks';

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
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkParameterId } from '../checks/other/checkParameterId';
import { checkReviewCreate, checkReviewUpdate } from '../checks/reviewChecks';
import { reviewQueries } from '../db/queries/reviewQueries';
import { convertDbRowToReview, convertReviewToReviewUpdate } from '../db/transformations/reviewTransformation';


interface ReviewRepository extends Repository {
  createReview: CreateActionWithContext<Review>;
  readReviewByBookDataId: ReadActionWithContext<Review>;
  readAllReviews: ReadAllActionWithContext<Review>;
  updateReview: UpdateActionWithContext<Review>;
  deleteReview: DeleteActionWithContext<Review>;
}

export const reviewRepository: ReviewRepository = {
  name: RepositoryName.review,

  createReview: async (context, loggedUsedId, body) => {
    try {
      const checked = checkReviewCreate(body);
      return await context.executeSingleResultQuery(convertDbRowToReview, reviewQueries.createReview, checked.bookDataId, checked.stars, checked.comment);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(reviewRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readReviewByBookDataId: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      return await context.executeSingleResultQuery(convertDbRowToReview, reviewQueries.getReviewByBookDataId, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(reviewRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllReviews: async (context) => {
    try {
      return await context.executeQuery(convertDbRowToReview, reviewQueries.getAllReviews);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(reviewRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateReview: async (context, loggedUserId, bookDataId, body) => {
    try {
      checkParameterId(bookDataId);
      const checked = checkReviewUpdate(body);
      const current = await reviewRepository.readReviewByBookDataId(context, loggedUserId, bookDataId);
      const currentData = convertReviewToReviewUpdate(current);
      const mergedUpdateData = merge(currentData, checked);

      const { comment, stars } = mergedUpdateData;

      if (isNull(comment) && isNull(stars)) {
        await context.executeSingleResultQuery(
          convertDbRowToReview,
          reviewQueries.deleteReview,
          bookDataId,
        );
        return { bookDataId: current.bookDataId, stars: null, comment: null };
      }

      return await context.executeSingleResultQuery(
        convertDbRowToReview,
        reviewQueries.updateReview,
        bookDataId, stars, comment,
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(reviewRepository.name, bookDataId, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
  deleteReview: async (context, loggedUserId, bookDataId) => {
    try {
      checkParameterId(bookDataId);
      return await context.executeSingleResultQuery(convertDbRowToReview, reviewQueries.deleteReview, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(reviewRepository.name, bookDataId);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
