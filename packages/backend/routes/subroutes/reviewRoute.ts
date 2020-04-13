import { Application } from 'express';

import { Review } from 'book-app-shared/types/Review';

import { review, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { ReviewRepository } from '../../repositories/ReviewRepository';


export const startReviewRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(review),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<Review>(ReviewRepository.createReview),
    }),
  );
};
