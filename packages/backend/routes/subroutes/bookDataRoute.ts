import { Application } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { bookDataRepository } from '../../repositories/BookDataRepository';


export const startBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    Path.bookData,
    bookDataRepository.createBookData,
  );

  requests.get(
    app,
    Path.bookData,
    bookDataRepository.readBookDataById,
  );

  requests.getAll(
    app,
    Path.bookData,
    bookDataRepository.readAllBookData,
  );

  requests.put(
    app,
    Path.bookData,
    bookDataRepository.updateBookData,
  );

  requests.delete(
    app,
    Path.bookData,
    bookDataRepository.deleteBookData,
  );
};
