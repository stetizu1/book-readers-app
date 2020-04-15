import { Author } from 'book-app-shared/types/Author';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import {
  ErrorMethod,
  getErrorPrefixAndPostfix,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';

import { checkAuthorCreate } from '../checks/authorCheck';
import { AuthorQueries } from '../db/queries/AuthorQueries';
import { createAuthorFromDbRow } from '../db/transformations/authorTransformation';


export class AuthorRepository {
  static REPO_NAME = 'Author';

  static createAuthorIfNotExist: CreateActionWithContext<Author> = async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(AuthorRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkAuthorCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      let row = await context.transaction.executeSingleOrNoResultQuery(AuthorQueries.getAuthorByName, stringifyParams(checked.name));
      if (row === null) {
        row = await context.transaction.executeSingleResultQuery(AuthorQueries.createAuthor, stringifyParams(checked.name));
      }

      return createAuthorFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAuthorById: ReadActionWithContext<Author> = async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(AuthorRepository.REPO_NAME, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(AuthorQueries.getAuthorById, stringifyParams(id));
      return createAuthorFromDbRow(row);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAllAuthors: ReadAllActionWithContext<Author> = async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(AuthorRepository.REPO_NAME, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(AuthorQueries.getAllAuthors);

      return await Promise.all(
        rows.map((row) => createAuthorFromDbRow(row)),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
