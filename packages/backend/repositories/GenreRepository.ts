import { Genre } from 'book-app-shared/types/Genre';
import { isValidId } from 'book-app-shared/helpers/validators';

import { ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import {
  ErrorMethod,
  getErrorPrefixAndPostfix,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError, processTransactionError } from '../helpers/getHttpError';

import { createGenreFromDbRow } from '../db/transformations/genreTransformation';
import { GenreQueries } from '../db/queries/GenreQueries';


export class GenreRepository {
  static REPO_NAME = 'Genre';

  static readGenreById: ReadActionWithContext<Genre> = async (context, id): Promise<Genre> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(GenreRepository.REPO_NAME, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleOrNoResultQuery(GenreQueries.getGenreById, stringifyParams(id));
      if (row) {
        return createGenreFromDbRow(row);
      }
      return Promise.reject(getHttpError.getNotFoundError(errPrefix, errPostfix));
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAllGenres: ReadAllActionWithContext<Genre> = async (context): Promise<Genre[]> => {
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
