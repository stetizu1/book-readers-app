import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { requests } from '../../helpers/express/expressCalls';
import { labelRepository } from '../../repositories/LabelRepository';


export const startLabelRoute = (app: Express): void => {
  requests.post(
    app,
    labelRepository.createLabel,
    Path.label,
  );

  requests.get(
    app,
    labelRepository.readLabelById,
    Path.label,
  );

  requests.getAll(
    app,
    labelRepository.readAllLabels,
    Path.label,
  );

  requests.put(
    app,
    labelRepository.updateLabel,
    Path.label,
  );

  requests.delete(
    app,
    labelRepository.deleteLabel,
    Path.label,
  );
};
