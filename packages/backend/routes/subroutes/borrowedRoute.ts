import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BorrowedRepository } from '../../repositories/BorrowedRepository';


export const startBorrowedRoute = (app: Application): void => {
  requests.post(
    app,
    Path.borrowed,
    wrapHandler.create(BorrowedRepository.createBorrowed),
  );

  requests.get(
    app,
    Path.borrowed,
    wrapHandler.read(BorrowedRepository.readBorrowedByBookDataId),
  );

  requests.getAll(
    app,
    Path.borrowed,
    wrapHandler.readAll(BorrowedRepository.readAllBorrowed),
  );
};
