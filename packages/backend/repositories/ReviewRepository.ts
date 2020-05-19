import { Review } from 'book-app-shared/types/Review';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { convertReviewToReviewUpdate } from 'book-app-shared/helpers/convert-to-update/review';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/string-helpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { merge } from '../helpers/db/merge';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkReviewCreate, checkReviewUpdate } from '../checks/invalid/review';
import { reviewQueries } from '../db/queries/reviewQueries';
import { convertDbRowToReview } from '../db/transformations/reviewTransformation';
import { checkPermissionBookData } from '../checks/forbidden/bookData';


interface ReviewRepository extends Repository {
  createReview: CreateActionWithContext<Review>;
  readReviewByBookDataId: ReadActionWithContext<Review | null>;
  readAllReviews: ReadAllActionWithContext<Review>;
  updateReview: UpdateActionWithContext<Review>;
  deleteReview: DeleteActionWithContext<Review>;
}

export const reviewRepository: ReviewRepository = {
  name: RepositoryName.review,

  createReview: async (context, loggedUserId, body) => {
    try {
      const reviewCreate = checkReviewCreate(body);
      await checkPermissionBookData.isOwner(context, loggedUserId, reviewCreate.bookDataId);
      return await context.executeSingleResultQuery(convertDbRowToReview, reviewQueries.createReview, reviewCreate.bookDataId, reviewCreate.stars, reviewCreate.comment);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(reviewRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readReviewByBookDataId: async (context, loggedUserId, param) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionBookData.isOwner(context, loggedUserId, bookDataId);
      return await context.executeSingleOrNoResultQuery(convertDbRowToReview, reviewQueries.getReviewByBookDataId, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(reviewRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllReviews: async (context, loggedUserId) => {
    try {
      return await context.executeQuery(convertDbRowToReview, reviewQueries.getAllReviews, loggedUserId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(reviewRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateReview: async (context, loggedUserId, param, body) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionBookData.isOwner(context, loggedUserId, bookDataId);
      const reviewUpdate = checkReviewUpdate(body);
      const current = await reviewRepository.readReviewByBookDataId(context, loggedUserId, bookDataId);
      if (isNull(current)) {
        return reviewRepository.createReview(context, loggedUserId, { ...reviewUpdate, bookDataId });
      }
      const currentData = convertReviewToReviewUpdate(current);
      const mergedUpdateData = merge(currentData, reviewUpdate);

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
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(reviewRepository.name, param, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
  deleteReview: async (context, loggedUserId, param) => {
    try {
      const bookDataId = checkParameterId(param);
      await checkPermissionBookData.isOwner(context, loggedUserId, bookDataId);
      return await context.executeSingleResultQuery(convertDbRowToReview, reviewQueries.deleteReview, bookDataId);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.delete(reviewRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
