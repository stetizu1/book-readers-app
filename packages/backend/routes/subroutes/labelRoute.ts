import { LabelPath } from 'book-app-shared/paths/LabelPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { labelRepository } from '../../repositories/LabelRepository';


export const startLabelRoute: Route = (app) => {
  requests.post(
    app,
    labelRepository.createLabel,
    LabelPath.post(),
  );

  requests.get(
    app,
    labelRepository.readLabelById,
    LabelPath.get(),
  );

  requests.getAll(
    app,
    labelRepository.readAllLabels,
    LabelPath.getAll(),
  );

  requests.put(
    app,
    labelRepository.updateLabel,
    LabelPath.put(),
  );

  requests.delete(
    app,
    labelRepository.deleteLabel,
    LabelPath.delete(),
  );
};
