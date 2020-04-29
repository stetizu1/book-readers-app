import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { requests } from '../../helpers/express/expressCalls';
import { reviewRepository } from '../../repositories/ReviewRepository';


export const startReviewRoute = (app: Express): void => {
  requests.post(
    app,
    reviewRepository.createReview,
    Path.review,
  );

  requests.get(
    app,
    reviewRepository.readReviewByBookDataId,
    Path.review,
  );

  requests.getAll(
    app,
    reviewRepository.readAllReviews,
    Path.review,
  );

  requests.put(
    app,
    reviewRepository.updateReview,
    Path.review,
  );

  requests.delete(
    app,
    reviewRepository.deleteReview,
    Path.review,
  );
};
