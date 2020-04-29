import { Express } from 'express';

import { Path, PathSpecification } from 'book-app-shared/constants/Path';

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

  requests.getAll(
    app,
    borrowedRepository.readAllBorrowedFromUser,
    Path.borrowed,
    PathSpecification.toUser,
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
