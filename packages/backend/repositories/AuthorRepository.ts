import { Author } from 'book-app-shared/types/Author';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CreateActionWithContext, ReadActionWithContext } from '../types/actionTypes';
import {
  ErrorMethod,
  getErrorPrefixAndPostfix,
  INVALID_ID,
} from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError, processTransactionError } from '../helpers/getHttpError';

import { AuthorQueries } from '../db/queries/AuthorQueries';
import { createAuthorFromDbRow } from '../db/transformations/authorTransformation';
import { checkAuthorCreate } from '../checks/authorCheck';


export class AuthorRepository {
  static REPO_NAME = 'Author';

  static createAuthorIfNotExist: CreateActionWithContext<Author> = async (context, body): Promise<Author> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(AuthorRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkAuthorCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const rowExists = await context.transaction.executeSingleOrNoResultQuery(AuthorQueries.getAuthorByName, stringifyParams(checked.name));
      if (rowExists) {
        return createAuthorFromDbRow(rowExists);
      }

      const rowCreate = await context.transaction.executeSingleResultQuery(AuthorQueries.createAuthor, stringifyParams(checked.name));
      return createAuthorFromDbRow(rowCreate);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAuthorById: ReadActionWithContext<Author> = async (context, id): Promise<Author> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(AuthorRepository.REPO_NAME, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const rowCreate = await context.transaction.executeSingleOrNoResultQuery(AuthorQueries.getAuthorById, stringifyParams(id));
      if (rowCreate) {
        return createAuthorFromDbRow(rowCreate);
      }
      return Promise.reject(getHttpError.getNotFoundError(errPrefix, errPostfix));
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}