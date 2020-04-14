import { Application } from 'express';

import { Genre } from 'book-app-shared/types/Genre';

import { genre, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { GenreRepository } from '../../repositories/GenreRepository';

export const startGenreRoute = (app: Application): void => {
  requests.get(
    app,
    path.get(genre),
    wrapHandler({
      type: ActionType.Read,
      callAction: executeWithContext.read<Genre>(GenreRepository.readGenreById),
    }),
  );
};
