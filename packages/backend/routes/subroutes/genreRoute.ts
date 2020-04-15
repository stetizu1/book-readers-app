import { Application } from 'express';

import { Path } from '../../constants/paths';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { GenreRepository } from '../../repositories/GenreRepository';


export const startGenreRoute = (app: Application): void => {
  requests.get(
    app,
    Path.genre,
    wrapHandler.read(GenreRepository.readGenreById),
  );

  requests.getAll(
    app,
    Path.genre,
    wrapHandler.readAll(GenreRepository.readAllGenres),
  );
};
