import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { hasLabelRepository } from '../../repositories/HasLabelRepository';


export const startHasLabelRoute = (app: Express): void => {
  requests.post(
    app,
    hasLabelRepository.createHasLabel,
    Path.hasLabel,
  );

  requests.get(
    app,
    hasLabelRepository.readHasLabelsByBookDataId,
    Path.hasLabel,
  );

  requests.deleteWithBody(
    app,
    hasLabelRepository.deleteHasLabel,
    Path.hasLabel,
  );
};
