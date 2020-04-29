import { BookRequestPath } from 'book-app-shared/paths/BookRequestPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { bookRequestRepository } from '../../repositories/BookRequestRepository';


export const startBookRequestRoute: Route = (app) => {
  requests.post(
    app,
    bookRequestRepository.createBookRequestWithBookData,
    BookRequestPath.post(),
  );

  requests.get(
    app,
    bookRequestRepository.readBookRequestByBookDataId,
    BookRequestPath.get(),
  );

  requests.getAll(
    app,
    bookRequestRepository.readAllBookRequests,
    BookRequestPath.getAll(),
  );

  requests.put(
    app,
    bookRequestRepository.updateBookRequest,
    BookRequestPath.put(),
  );

  requests.delete(
    app,
    bookRequestRepository.deleteBookRequest,
    BookRequestPath.delete(),
  );
};
