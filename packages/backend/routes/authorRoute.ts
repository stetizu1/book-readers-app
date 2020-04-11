import { Application } from 'express';

import { Author } from 'book-app-shared/types/Author';

import { author, path } from '../constants/paths';
import { ActionType } from '../constants/actionTypes';
import { requests } from '../helpers/express/expressCalls';
import { wrapHandler } from '../helpers/express/wrapHandler';
import { executeWithContext } from '../storage_context/executeWithContext';
import { AuthorRepository } from '../repositories/AuthorRepository';


export const startAuthor = (app: Application): void => {
  requests.get(
    app,
    path.get(author),
    wrapHandler({
      type: ActionType.Read,
      callAction: executeWithContext.read<Author>(AuthorRepository.readAuthorById),
    }),
  );
};
