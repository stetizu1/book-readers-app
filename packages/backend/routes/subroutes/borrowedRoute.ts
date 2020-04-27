import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { borrowedRepository } from '../../repositories/BorrowedRepository';


export const startBorrowedRoute = (app: Express): void => {
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
    borrowedRepository.readAllBorrowedFromUser,
  );

  requests.put(
    app,
    Path.borrowed,
    borrowedRepository.updateBorrowed,
  );

  requests.delete(
    app,
    Path.borrowed,
    borrowedRepository.deleteBorrowed,
  );
};
