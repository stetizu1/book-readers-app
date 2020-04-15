import { Application } from 'express';

import { Review } from 'book-app-shared/types/Review';

import { hasLabel, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { HasLabelRepository } from '../../repositories/HasLabelRepository';


export const startHasLabelRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(hasLabel),
    wrapHandler.create<Review>(HasLabelRepository.createHasLabel),
  );
};
