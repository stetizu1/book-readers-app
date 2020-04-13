import { Application } from 'express';

import { Review } from 'book-app-shared/types/Review';

import { hasLabel, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { HasLabelRepository } from '../../repositories/HasLabelRepository';


export const startHasLabelRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(hasLabel),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<Review>(HasLabelRepository.createHasLabel),
    }),
  );
};
