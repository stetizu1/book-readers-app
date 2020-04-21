import { Application } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { borrowedRepository } from '../../repositories/BorrowedRepository';


export const startBorrowedRoute = (app: Application): void => {
  requests.post(
    app,
    Path.borrowed,
    borrowedRepository.createBorrowed,
  );

  requests.get(
    app,
    Path.borrowed,
    borrowedRepository.readBorrowedById,
  );

  requests.getAll(
    app,
    Path.borrowed,
    borrowedRepository.readAllBorrowed,
  );

  requests.put(
    app,
    Path.borrowed,
    borrowedRepository.updateBorrowed,
  );
};
