import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { AuthorRepository } from '../../repositories/AuthorRepository';


export const startAuthorRoute = (app: Application): void => {
  requests.get(
    app,
    Path.author,
    wrapHandler.read(AuthorRepository.readAuthorById),
  );

  requests.getAll(
    app,
    Path.author,
    wrapHandler.readAll(AuthorRepository.readAllAuthors),
  );
};
