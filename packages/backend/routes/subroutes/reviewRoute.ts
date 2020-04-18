import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { reviewRepository } from '../../repositories/ReviewRepository';


export const startReviewRoute = (app: Application): void => {
  requests.post(
    app,
    Path.review,
    reviewRepository.createReview,
  );
};
