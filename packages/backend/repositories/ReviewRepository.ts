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

  createReview: async (context, loggedUsedId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(reviewRepository.name, body);

    const checked = checkReviewCreate(body, errPrefix, errPostfix);

    try {
      return await context.executeSingleResultQuery(createReviewFromDbRow, reviewQueries.createReview, checked.bookDataId, checked.stars, checked.comment);
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
      return await context.executeSingleResultQuery(createReviewFromDbRow, reviewQueries.getReviewByBookDataId, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllReviews: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(reviewRepository.name);

    try {
      return await context.executeQuery(createReviewFromDbRow, reviewQueries.getAllReviews);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  updateReview: async (context, loggedUserId, bookDataId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.update(reviewRepository.name, bookDataId, body);

    const checked = checkReviewUpdate(body, errPrefix, errPostfix);

    try {
      const current = await reviewRepository.readReviewByBookDataId(context, loggedUserId, bookDataId);
      const currentData = transformReviewUpdateFromReview(current);
      const mergedUpdateData = merge(currentData, checked);

      const { comment, stars } = mergedUpdateData;

      if (isNull(comment) && isNull(stars)) {
        await context.executeSingleResultQuery(
          createReviewFromDbRow,
          reviewQueries.deleteReview,
          bookDataId,
        );
        return { bookDataId: current.bookDataId, stars: null, comment: null };
      }

      return await context.executeSingleResultQuery(
        createReviewFromDbRow,
        reviewQueries.updateReview,
        bookDataId, stars, comment,
      );
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
      return await context.executeSingleResultQuery(createReviewFromDbRow, reviewQueries.deleteReview, bookDataId);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
