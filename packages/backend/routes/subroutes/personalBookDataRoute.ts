import { PersonalBookDataPath } from 'book-app-shared/paths/PersonalBookDataPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { personalBookDataRepository } from '../../repositories/PersonalBookDataRepository';


export const startPersonalBookDataRoute: Route = (app) => {
  requests.post(
    app,
    personalBookDataRepository.createPersonalBookData,
    PersonalBookDataPath.post(),
  );

  requests.get(
    app,
    personalBookDataRepository.readPersonalBookDataByBookDataId,
    PersonalBookDataPath.get(),
  );

  requests.getAll(
    app,
    personalBookDataRepository.readAllPersonalBookData,
    PersonalBookDataPath.getAll(),
  );

  requests.put(
    app,
    personalBookDataRepository.updatePersonalBookData,
    PersonalBookDataPath.put(),
  );

  requests.delete(
    app,
    personalBookDataRepository.deletePersonalBookData,
    PersonalBookDataPath.delete(),
  );
};
