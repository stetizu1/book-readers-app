import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { requests } from '../../helpers/express/expressCalls';
import { personalBookDataRepository } from '../../repositories/PersonalBookDataRepository';


export const startPersonalBookDataRoute = (app: Express): void => {
  requests.post(
    app,
    personalBookDataRepository.createPersonalBookData,
    Path.personalBookData,
  );

  requests.get(
    app,
    personalBookDataRepository.readPersonalBookDataByBookDataId,
    Path.personalBookData,
  );

  requests.put(
    app,
    personalBookDataRepository.updatePersonalBookData,
    Path.personalBookData,
  );

  requests.delete(
    app,
    personalBookDataRepository.deletePersonalBookData,
    Path.personalBookData,
  );
};
