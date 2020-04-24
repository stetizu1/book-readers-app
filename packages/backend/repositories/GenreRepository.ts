import { Genre } from 'book-app-shared/types/Genre';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';

import { genreQueries } from '../db/queries/genreQueries';
import { createGenreFromDbRow } from '../db/transformations/genreTransformation';


interface GenreRepository extends Repository {
  readGenreById: ReadActionWithContext<Genre>;
  readAllGenres: ReadAllActionWithContext<Genre>;
}

export const genreRepository: GenreRepository = {
  name: RepositoryName.genre,

  readGenreById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(genreRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(genreQueries.getGenreById, id);
      return createGenreFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllGenres: async (context, loggedUserId) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(genreRepository.name);

    try {
      const rows = await context.executeQuery(genreQueries.getAllGenres);

      return createArrayFromDbRows(rows, createGenreFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
