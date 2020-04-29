import { Express } from 'express';

import { Path } from 'book-app-shared/constants/Path';

import { requests } from '../../helpers/express/expressCalls';
import { genreRepository } from '../../repositories/GenreRepository';


export const startGenreRoute = (app: Express): void => {
  requests.get(
    app,
    genreRepository.readGenreById,
    Path.genre,
  );

  requests.getAll(
    app,
    genreRepository.readAllGenres,
    Path.genre,
  );
};
