import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { bookRequestRepository } from '../../repositories/BookRequestRepository';


export const startBookRequestRoute = (app: Application): void => {
  requests.post(
    app,
    Path.bookRequest,
    bookRequestRepository.createBookRequest,
  );

  requests.get(
    app,
    Path.bookRequest,
    bookRequestRepository.readBookRequestByBookDataId,
  );

  requests.getAll(
    app,
    Path.bookRequest,
    bookRequestRepository.readAllBookRequests,
  );
};
