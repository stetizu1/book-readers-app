import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { bookRepository } from '../../repositories/BookRepository';


export const startBookRoute = (app: Express): void => {
  requests.post(
    app,
    bookRepository.createBook,
    Path.book,
  );

  requests.get(
    app,
    bookRepository.readBookById,
    Path.book,
  );

  requests.getAll(
    app,
    bookRepository.readAllBooks,
    Path.book,
  );
};
