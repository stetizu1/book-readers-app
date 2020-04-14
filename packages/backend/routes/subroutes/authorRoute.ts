import { Application } from 'express';

import { Author } from 'book-app-shared/types/Author';

import { author, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { AuthorRepository } from '../../repositories/AuthorRepository';


export const startAuthorRoute = (app: Application): void => {
  requests.get(
    app,
    path.get(author),
    wrapHandler({
      type: ActionType.Read,
      callAction: executeWithContext.read<Author>(AuthorRepository.readAuthorById),
    }),
  );

  requests.get(
    app,
    path.getAll(author),
    wrapHandler({
      type: ActionType.Read,
      callAction: executeWithContext.readAll<Author>(AuthorRepository.readAllAuthors),
    }),
  );
};
