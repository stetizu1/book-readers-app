import { BookDataPath } from 'book-app-shared/paths/BookDataPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { bookDataRepository } from '../../repositories/BookDataRepository';


export const startBookDataRoute: Route = (app) => {
  requests.post(
    app,
    bookDataRepository.createBookData,
    BookDataPath.post(),
  );

  requests.get(
    app,
    bookDataRepository.readBookDataById,
    BookDataPath.get(),
  );

  requests.getAll(
    app,
    bookDataRepository.readAllBookData,
    BookDataPath.getAll(),
  );

  requests.put(
    app,
    bookDataRepository.updateBookData,
    BookDataPath.put(),
  );

  requests.delete(
    app,
    bookDataRepository.deleteBookData,
    BookDataPath.delete(),
  );
};
