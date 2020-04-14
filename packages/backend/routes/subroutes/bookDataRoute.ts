import { Application } from 'express';

import { BookData } from 'book-app-shared/types/BookData';

import { bookData, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { BookDataRepository } from '../../repositories/BookDataRepository';


export const startBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(bookData),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<BookData>(BookDataRepository.createBookData),
    }),
  );

  requests.get(
    app,
    path.get(bookData),
    wrapHandler({
      type: ActionType.Read,
      callAction: executeWithContext.read<BookData>(BookDataRepository.readBookDataById),
    }),
  );

  requests.get(
    app,
    path.getAll(bookData),
    wrapHandler({
      type: ActionType.ReadAll,
      callAction: executeWithContext.readAll<BookData>(BookDataRepository.readAllBookData),
    }),
  );
};
