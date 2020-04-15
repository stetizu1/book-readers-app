import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { PersonalBookDataRepository } from '../../repositories/PersonalBookDataRepository';


export const startPersonalBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    Path.personalBookData,
    wrapHandler.create(PersonalBookDataRepository.createPersonalBookData),
  );
};
