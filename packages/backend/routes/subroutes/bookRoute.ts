import { BookPath } from 'book-app-shared/paths/BookPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { bookRepository } from '../../repositories/BookRepository';


export const startBookRoute: Route = (app) => {
  requests.post(
    app,
    bookRepository.createBook,
    BookPath.post(),
  );

  requests.get(
    app,
    bookRepository.readBookById,
    BookPath.get(),
  );

  requests.getAll(
    app,
    bookRepository.readAllBooks,
    BookPath.getAll(),
  );
};
