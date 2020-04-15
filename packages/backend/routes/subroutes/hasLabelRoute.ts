import { Application } from 'express';

import { Review } from 'book-app-shared/types/Review';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { HasLabelRepository } from '../../repositories/HasLabelRepository';


export const startHasLabelRoute = (app: Application): void => {
  requests.post(
    app,
    Path.hasLabel,
    wrapHandler.create<Review>(HasLabelRepository.createHasLabel),
  );
};
