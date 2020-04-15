import { Application } from 'express';

import { author, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { AuthorRepository } from '../../repositories/AuthorRepository';


export const startAuthorRoute = (app: Application): void => {
  requests.get(
    app,
    path.get(author),
    wrapHandler.read(AuthorRepository.readAuthorById),
  );

  requests.get(
    app,
    path.getAll(author),
    wrapHandler.readAll(AuthorRepository.readAllAuthors),
  );
};
