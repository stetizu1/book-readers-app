import { Application } from 'express';

import { borrowed, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BorrowedRepository } from '../../repositories/BorrowedRepository';


export const startBorrowedRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(borrowed),
    wrapHandler.create(BorrowedRepository.createBorrowed),
  );
};
