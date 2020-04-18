import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { labelRepository } from '../../repositories/LabelRepository';


export const startLabelRoute = (app: Application): void => {
  requests.post(
    app,
    Path.label,
    labelRepository.createLabel,
  );

  requests.get(
    app,
    Path.label,
    labelRepository.readLabelById,
  );

  requests.getAll(
    app,
    Path.label,
    labelRepository.readAllLabels,
  );
};
