import { Application } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { reviewRepository } from '../../repositories/ReviewRepository';


export const startReviewRoute = (app: Application): void => {
  requests.post(
    app,
    Path.review,
    reviewRepository.createReview,
  );

  requests.get(
    app,
    Path.review,
    reviewRepository.readReviewByBookDataId,
  );

  requests.getAll(
    app,
    Path.review,
    reviewRepository.readAllReviews,
  );

  requests.put(
    app,
    Path.review,
    reviewRepository.updateReview,
  );

  requests.delete(
    app,
    Path.review,
    reviewRepository.deleteReview,
  );
};
