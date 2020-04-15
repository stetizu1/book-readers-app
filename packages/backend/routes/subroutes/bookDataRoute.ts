import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BookDataRepository } from '../../repositories/BookDataRepository';


export const startBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    Path.bookData,
    wrapHandler.create(BookDataRepository.createBookData),
  );

  requests.get(
    app,
    Path.bookData,
    wrapHandler.read(BookDataRepository.readBookDataById),
  );

  requests.getAll(
    app,
    Path.bookData,
    wrapHandler.readAll(BookDataRepository.readAllBookData),
  );
};
