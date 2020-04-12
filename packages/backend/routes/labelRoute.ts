import { Application } from 'express';

import { Label } from 'book-app-shared/types/Label';

import { label, path } from '../constants/paths';
import { ActionType } from '../constants/actionTypes';
import { requests } from '../helpers/express/expressCalls';
import { wrapHandler } from '../helpers/express/wrapHandler';
import { executeWithContext } from '../storage_context/executeWithContext';
import { LabelRepository } from '../repositories/LabelRepository';


export const startLabelRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(label),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<Label>(LabelRepository.createLabel),
    }),
  );
};
