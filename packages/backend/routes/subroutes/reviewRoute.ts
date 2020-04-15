import { Application } from 'express';

import { review, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { ReviewRepository } from '../../repositories/ReviewRepository';


export const startReviewRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(review),
    wrapHandler.create(ReviewRepository.createReview),
  );
};
