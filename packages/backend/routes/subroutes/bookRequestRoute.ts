import { Application } from 'express';

import { BookRequest } from 'book-app-shared/types/BookRequest';

import { bookRequest, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { BookRequestRepository } from '../../repositories/BookRequestRepository';


export const startBookRequestRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(bookRequest),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<BookRequest>(BookRequestRepository.createBookRequest),
    }),
  );

  requests.get(
    app,
    path.get(bookRequest),
    wrapHandler({
      type: ActionType.Read,
      callAction: executeWithContext.read<BookRequest>(BookRequestRepository.readBookRequestById),
    }),
  );

  requests.get(
    app,
    path.getAll(bookRequest),
    wrapHandler({
      type: ActionType.ReadAll,
      callAction: executeWithContext.readAll<BookRequest>(BookRequestRepository.readAllBookRequests),
    }),
  );
};
