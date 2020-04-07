import { Express } from 'express';
import { author, path } from '../constants/paths';
import { ActionTypes } from '../constants/ActionTypes';
import { requests } from '../helpers/express/expressCalls';
import { wrapHandler } from '../helpers/express/wrapHandler';
import { AuthorRepository } from '../repositories/authorRepository';
import { executeWithContext } from '../storage_context/executeWithContext';
import { Author } from '../../shared/types/Author';

export const startAuthor = (app: Express): void => {
  requests.post(
    app,
    path.post(author),
    wrapHandler({
      type: ActionTypes.Create,
      callAction: executeWithContext.create<Author>(AuthorRepository.createAuthor),
    }),
  );
};
