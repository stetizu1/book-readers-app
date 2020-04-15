import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { ReviewRepository } from '../../repositories/ReviewRepository';


export const startReviewRoute = (app: Application): void => {
  requests.post(
    app,
    Path.review,
    wrapHandler.create(ReviewRepository.createReview),
  );
};
