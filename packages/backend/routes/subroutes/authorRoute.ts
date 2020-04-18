import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { authorRepository } from '../../repositories/AuthorRepository';


export const startAuthorRoute = (app: Application): void => {
  requests.get(
    app,
    Path.author,
    authorRepository.readAuthorById,
  );

  requests.getAll(
    app,
    Path.author,
    authorRepository.readAllAuthors,
  );
};
