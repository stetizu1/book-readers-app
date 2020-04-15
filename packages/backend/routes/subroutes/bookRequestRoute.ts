import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BookRequestRepository } from '../../repositories/BookRequestRepository';


export const startBookRequestRoute = (app: Application): void => {
  requests.post(
    app,
    Path.bookRequest,
    wrapHandler.create(BookRequestRepository.createBookRequest),
  );

  requests.get(
    app,
    Path.bookRequest,
    wrapHandler.read(BookRequestRepository.readBookRequestById),
  );

  requests.getAll(
    app,
    Path.bookRequest,
    wrapHandler.readAll(BookRequestRepository.readAllBookRequests),
  );
};
