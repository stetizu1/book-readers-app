import { Application } from 'express';

import { Borrowed } from 'book-app-shared/types/Borrowed';

import { borrowed, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { BorrowedRepository } from '../../repositories/BorrowedRepository';


export const startBorrowedRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(borrowed),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<Borrowed>(BorrowedRepository.createBorrowed),
    }),
  );
};
