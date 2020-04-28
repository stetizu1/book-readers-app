import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { authorRepository } from '../../repositories/AuthorRepository';


export const startAuthorRoute = (app: Express): void => {
  requests.get(
    app,
    authorRepository.readAuthorById,
    Path.author,
  );

  requests.getAll(
    app,
    authorRepository.readAllAuthors,
    Path.author,
  );
};
