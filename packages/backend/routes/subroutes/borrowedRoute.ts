import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { borrowedRepository } from '../../repositories/BorrowedRepository';


export const startBorrowedRoute = (app: Express): void => {
  requests.post(
    app,
    borrowedRepository.createBorrowed,
    Path.borrowed,
  );

  requests.get(
    app,
    borrowedRepository.readBorrowedById,
    Path.borrowed,
  );

  requests.getAll(
    app,
    borrowedRepository.readAllBorrowedFromUser,
    Path.borrowed,
  );

  requests.put(
    app,
    borrowedRepository.updateBorrowed,
    Path.borrowed,
  );

  requests.delete(
    app,
    borrowedRepository.deleteBorrowed,
    Path.borrowed,
  );
};
