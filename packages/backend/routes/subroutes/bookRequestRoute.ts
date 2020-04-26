import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { bookRequestRepository } from '../../repositories/BookRequestRepository';


export const startBookRequestRoute = (app: Express): void => {
  requests.post(
    app,
    Path.bookRequest,
    bookRequestRepository.createBookRequestWithBookData,
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

  requests.put(
    app,
    Path.bookRequest,
    bookRequestRepository.updateBookRequest,
  );

  requests.delete(
    app,
    Path.bookRequest,
    bookRequestRepository.deleteBookRequest,
  );
};
