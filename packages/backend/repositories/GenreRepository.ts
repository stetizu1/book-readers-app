import { Genre } from 'book-app-shared/types/Genre';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import {
  ErrorMethod,
  getErrorPrefixAndPostfix,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';
import { createArrayFromDbRows } from '../helpers/db/createFromDbRow';

import { genreQueries } from '../db/queries/genreQueries';
import { createGenreFromDbRow } from '../db/transformations/genreTransformation';


interface GenreRepository extends Repository {
  readGenreById: ReadActionWithContext<Genre>;
  readAllGenres: ReadAllActionWithContext<Genre>;
}

export const genreRepository: GenreRepository = {
  name: 'Genre',

  readGenreById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(genreRepository.name, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(genreQueries.getGenreById, stringifyParams(id));
      return createGenreFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllGenres: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(genreRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(genreQueries.getAllGenres);

      return createArrayFromDbRows(rows, createGenreFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
