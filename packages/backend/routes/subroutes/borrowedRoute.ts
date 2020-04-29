import { BorrowedPath } from 'book-app-shared/paths/BorrowedPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { borrowedRepository } from '../../repositories/BorrowedRepository';


export const startBorrowedRoute: Route = (app) => {
  requests.post(
    app,
    borrowedRepository.createBorrowed,
    BorrowedPath.post(),
  );

  requests.get(
    app,
    borrowedRepository.readBorrowedById,
    BorrowedPath.get(),
  );

  requests.getAll(
    app,
    borrowedRepository.readAllBorrowedFromUser,
    BorrowedPath.getAll(),
  );

  requests.getAll(
    app,
    borrowedRepository.readAllBorrowedFromUser,
    BorrowedPath.getAllToUser(),
  );

  requests.put(
    app,
    borrowedRepository.updateBorrowed,
    BorrowedPath.put(),
  );

  requests.delete(
    app,
    borrowedRepository.deleteBorrowed,
    BorrowedPath.delete(),
  );
};
