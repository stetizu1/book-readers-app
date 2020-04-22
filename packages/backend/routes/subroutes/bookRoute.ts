import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { bookRepository } from '../../repositories/BookRepository';


export const startBookRoute = (app: Express): void => {
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
