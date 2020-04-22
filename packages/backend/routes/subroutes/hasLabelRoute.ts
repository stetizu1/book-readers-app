import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { hasLabelRepository } from '../../repositories/HasLabelRepository';


export const startHasLabelRoute = (app: Express): void => {
  requests.post(
    app,
    Path.hasLabel,
    hasLabelRepository.createHasLabel,
  );

  requests.get(
    app,
    Path.hasLabel,
    hasLabelRepository.readHasLabelsByBookDataId,
  );

  requests.deleteWithBody(
    app,
    Path.hasLabel,
    hasLabelRepository.deleteHasLabel,
  );
};
