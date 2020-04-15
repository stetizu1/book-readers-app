import { Genre } from 'book-app-shared/types/Genre';
import { isValidId } from 'book-app-shared/helpers/validators';

import { ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import {
  ErrorMethod,
  getErrorPrefixAndPostfix,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';

import { GenreQueries } from '../db/queries/GenreQueries';
import { createGenreFromDbRow } from '../db/transformations/genreTransformation';


export class GenreRepository {
  static REPO_NAME = 'Genre';

  static readGenreById: ReadActionWithContext<Genre> = async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(GenreRepository.REPO_NAME, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(GenreQueries.getGenreById, stringifyParams(id));
      return createGenreFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAllGenres: ReadAllActionWithContext<Genre> = async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(GenreRepository.REPO_NAME, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(GenreQueries.getAllGenres);

      return await Promise.all(
        rows.map((row) => createGenreFromDbRow(row)),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
