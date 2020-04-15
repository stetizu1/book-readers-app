import { Application } from 'express';

import { bookData, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BookDataRepository } from '../../repositories/BookDataRepository';


export const startBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(bookData),
    wrapHandler.create(BookDataRepository.createBookData),
  );

  requests.get(
    app,
    path.get(bookData),
    wrapHandler.read(BookDataRepository.readBookDataById),
  );

  requests.get(
    app,
    path.getAll(bookData),
    wrapHandler.readAll(BookDataRepository.readAllBookData),
  );
};
