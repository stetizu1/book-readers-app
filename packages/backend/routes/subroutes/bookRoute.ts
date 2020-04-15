import { Application } from 'express';

import { Book } from 'book-app-shared/types/Book';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BookRepository } from '../../repositories/BookRepository';


export const startBookRoute = (app: Application): void => {
  requests.post(
    app,
    Path.book,
    wrapHandler.create(BookRepository.createBook),
  );

  requests.get(
    app,
    Path.book,
    wrapHandler.read<Book>(BookRepository.readBookById),
  );

  requests.getAll(
    app,
    Path.book,
    wrapHandler.readAll<Book>(BookRepository.readAllBooks),
  );
};
