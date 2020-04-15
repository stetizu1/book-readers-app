import { Application } from 'express';

import { Book } from 'book-app-shared/types/Book';

import { book, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { BookRepository } from '../../repositories/BookRepository';


export const startBookRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(book),
    wrapHandler.create(BookRepository.createBook),
  );

  requests.get(
    app,
    path.get(book),
    wrapHandler.read<Book>(BookRepository.readBookById),
  );

  requests.get(
    app,
    path.getAll(book),
    wrapHandler.readAll<Book>(BookRepository.readAllBooks),
  );
};
