import { GenrePath } from 'book-app-shared/paths/GenrePath';

import { Route } from '../../types/Route';
import { requests } from '../../helpers/express/expressCalls';
import { genreRepository } from '../../repositories/GenreRepository';


export const startGenreRoute: Route = (app) => {
  requests.get(
    app,
    genreRepository.readGenreById,
    GenrePath.get(),
  );

  requests.getAll(
    app,
    genreRepository.readAllGenres,
    GenrePath.getAll(),
  );
};
