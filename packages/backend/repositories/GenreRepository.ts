import { Genre } from 'book-app-shared/types/Genre';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import { ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { genreQueries } from '../db/queries/genreQueries';
import { convertDbRowToGenre } from '../db/transformations/genreTransformation';
import { checkParameterId } from '../checks/parameter/checkParameterId';


interface GenreRepository extends Repository {
  readGenreById: ReadActionWithContext<Genre>;
  readAllGenres: ReadAllActionWithContext<Genre>;
}

export const genreRepository: GenreRepository = {
  name: RepositoryName.genre,

  readGenreById: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      return await context.executeSingleResultQuery(convertDbRowToGenre, genreQueries.getGenreById, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(genreRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllGenres: async (context) => {
    try {
      return await context.executeQuery(convertDbRowToGenre, genreQueries.getAllGenres);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(genreRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
