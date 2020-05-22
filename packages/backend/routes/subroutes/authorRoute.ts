import { AuthorPath } from 'book-app-shared/paths/AuthorPath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { authorRepository } from '../../repositories/AuthorRepository';


export const startAuthorRoute: Route = (app) => {
  requests.get(
    app,
    authorRepository.readAuthorById,
    AuthorPath.get(),
  );

  requests.getAll(
    app,
    authorRepository.readAllAuthors,
    AuthorPath.getAll(),
  );
};
