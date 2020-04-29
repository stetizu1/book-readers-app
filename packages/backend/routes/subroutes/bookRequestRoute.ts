import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { requests } from '../../helpers/express/expressCalls';
import { bookRequestRepository } from '../../repositories/BookRequestRepository';


export const startBookRequestRoute = (app: Express): void => {
  requests.post(
    app,
    bookRequestRepository.createBookRequestWithBookData,
    Path.bookRequest,
  );

  requests.get(
    app,
    bookRequestRepository.readBookRequestByBookDataId,
    Path.bookRequest,
  );

  requests.getAll(
    app,
    bookRequestRepository.readAllBookRequests,
    Path.bookRequest,
  );

  requests.put(
    app,
    bookRequestRepository.updateBookRequest,
    Path.bookRequest,
  );

  requests.delete(
    app,
    bookRequestRepository.deleteBookRequest,
    Path.bookRequest,
  );
};
