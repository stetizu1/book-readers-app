import { HasLabelPath } from 'book-app-shared/paths/HasLabelPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { hasLabelRepository } from '../../repositories/HasLabelRepository';


export const startHasLabelRoute: Route = (app) => {
  requests.post(
    app,
    hasLabelRepository.createHasLabel,
    HasLabelPath.post(),
  );

  requests.get(
    app,
    hasLabelRepository.readHasLabelsByBookDataId,
    HasLabelPath.get(),
  );

  requests.deleteOnTwoParams(
    app,
    hasLabelRepository.deleteHasLabel,
    HasLabelPath.delete(),
  );
};
