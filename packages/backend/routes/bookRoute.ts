import { Application } from 'express';

import { Book } from 'book-app-shared/types/Book';

import { book, path } from '../constants/paths';
import { ActionType } from '../constants/actionTypes';
import { requests } from '../helpers/express/expressCalls';
import { wrapHandler } from '../helpers/express/wrapHandler';
import { executeWithContext } from '../storage_context/executeWithContext';
import { BookRepository } from '../repositories/BookRepository';


export const startBookRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(book),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<Book>(BookRepository.createBook),
    }),
  );
};
