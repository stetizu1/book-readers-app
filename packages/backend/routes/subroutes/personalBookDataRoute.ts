import { Application } from 'express';

import { Path } from '../../constants/Path';
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

  requests.put(
    app,
    Path.personalBookData,
    personalBookDataRepository.updatePersonalBookData,
  );

  requests.delete(
    app,
    Path.personalBookData,
    personalBookDataRepository.deletePersonalBookData,
  );
};
