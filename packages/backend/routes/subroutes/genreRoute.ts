import { Application } from 'express';

import { genre, path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { GenreRepository } from '../../repositories/GenreRepository';


export const startGenreRoute = (app: Application): void => {
  requests.get(
    app,
    path.get(genre),
    wrapHandler.read(GenreRepository.readGenreById),
  );

  requests.get(
    app,
    path.getAll(genre),
    wrapHandler.readAll(GenreRepository.readAllGenres),
  );
};
