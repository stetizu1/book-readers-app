import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { personalBookDataRepository } from '../../repositories/PersonalBookDataRepository';


export const startPersonalBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    Path.personalBookData,
    personalBookDataRepository.createPersonalBookData,
  );

  requests.get(
    app,
    Path.personalBookData,
    personalBookDataRepository.readPersonalBookDataByBookDataId,
  );
};
