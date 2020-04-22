import { Express } from 'express';

import { Path } from '../../constants/Path';
import { requests } from '../../helpers/express/expressCalls';
import { genreRepository } from '../../repositories/GenreRepository';


export const startGenreRoute = (app: Express): void => {
  requests.get(
    app,
    Path.genre,
    genreRepository.readGenreById,
  );

  requests.getAll(
    app,
    Path.genre,
    genreRepository.readAllGenres,
  );
};
