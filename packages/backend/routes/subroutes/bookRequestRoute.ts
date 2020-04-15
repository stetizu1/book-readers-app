import { Application } from 'express';

import { bookRequest, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BookRequestRepository } from '../../repositories/BookRequestRepository';


export const startBookRequestRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(bookRequest),
    wrapHandler.create(BookRequestRepository.createBookRequest),
  );

  requests.get(
    app,
    path.get(bookRequest),
    wrapHandler.read(BookRequestRepository.readBookRequestById),
  );

  requests.get(
    app,
    path.getAll(bookRequest),
    wrapHandler.readAll(BookRequestRepository.readAllBookRequests),
  );
};
