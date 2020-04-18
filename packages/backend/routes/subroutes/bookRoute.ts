import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { bookRepository } from '../../repositories/BookRepository';


export const startBookRoute = (app: Application): void => {
  requests.post(
    app,
    Path.book,
    bookRepository.createBook,
  );

  requests.get(
    app,
    Path.book,
    bookRepository.readBookById,
  );

  requests.getAll(
    app,
    Path.book,
    bookRepository.readAllBooks,
  );
};
