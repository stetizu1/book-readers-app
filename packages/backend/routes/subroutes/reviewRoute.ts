import { ReviewPath } from 'book-app-shared/paths/ReviewPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { reviewRepository } from '../../repositories/ReviewRepository';


export const startReviewRoute: Route = (app) => {
  requests.post(
    app,
    reviewRepository.createReview,
    ReviewPath.post(),
  );

  requests.get(
    app,
    reviewRepository.readReviewByBookDataId,
    ReviewPath.get(),
  );

  requests.getAll(
    app,
    reviewRepository.readAllReviews,
    ReviewPath.getAll(),
  );

  requests.put(
    app,
    reviewRepository.updateReview,
    ReviewPath.put(),
  );

  requests.delete(
    app,
    reviewRepository.deleteReview,
    ReviewPath.delete(),
  );
};
