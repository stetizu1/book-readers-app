import { Application } from 'express';

import { Label } from 'book-app-shared/types/Label';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { LabelRepository } from '../../repositories/LabelRepository';


export const startLabelRoute = (app: Application): void => {
  requests.post(
    app,
    Path.label,
    wrapHandler.create<Label>(LabelRepository.createLabel),
  );
};
