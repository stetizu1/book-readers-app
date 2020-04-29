import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { requests } from '../../helpers/express/expressCalls';
import { bookDataRepository } from '../../repositories/BookDataRepository';


export const startBookDataRoute = (app: Express): void => {
  requests.post(
    app,
    bookDataRepository.createBookData,
    Path.bookData,
  );

  requests.get(
    app,
    bookDataRepository.readBookDataById,
    Path.bookData,
  );

  requests.getAll(
    app,
    bookDataRepository.readAllBookData,
    Path.bookData,
  );

  requests.put(
    app,
    bookDataRepository.updateBookData,
    Path.bookData,
  );

  requests.delete(
    app,
    bookDataRepository.deleteBookData,
    Path.bookData,
  );
};
