import { Application } from 'express';

import { personalBookData, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { PersonalBookDataRepository } from '../../repositories/PersonalBookDataRepository';


export const startPersonalBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(personalBookData),
    wrapHandler.create(PersonalBookDataRepository.createPersonalBookData),
  );
};
