import { Genre } from 'book-app-shared/types/Genre';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';

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
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(createGenreFromDbRow, genreQueries.getGenreById, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllGenres: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(genreRepository.name);

    try {
      return await context.executeQuery(createGenreFromDbRow, genreQueries.getAllGenres);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
