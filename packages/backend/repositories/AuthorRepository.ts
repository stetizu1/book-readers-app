import { Author } from 'book-app-shared/types/Author';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import {
  ErrorMethod,
  getErrorPrefixAndPostfix,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';
import { createArrayFromDbRows } from '../db/createFromDbRow';

import { checkAuthorCreate } from '../checks/authorCheck';
import { authorQueries } from '../db/queries/authorQueries';
import { createAuthorFromDbRow } from '../db/transformations/authorTransformation';


interface AuthorRepository extends Repository {
  createAuthorIfNotExist: CreateActionWithContext<Author>;
  readAuthorById: ReadActionWithContext<Author>;
  readAllAuthors: ReadAllActionWithContext<Author>;
}

export const authorRepository: AuthorRepository = {
  name: 'Author',

  createAuthorIfNotExist: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(authorRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkAuthorCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      let row = await context.transaction.executeSingleOrNoResultQuery(authorQueries.getAuthorByName, stringifyParams(checked.name));
      if (row === null) {
        row = await context.transaction.executeSingleResultQuery(authorQueries.createAuthor, stringifyParams(checked.name));
      }

      return createAuthorFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAuthorById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(authorRepository.name, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(authorQueries.getAuthorById, stringifyParams(id));
      return createAuthorFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllAuthors: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(authorRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(authorQueries.getAllAuthors);

      return createArrayFromDbRows(rows, createAuthorFromDbRow);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
