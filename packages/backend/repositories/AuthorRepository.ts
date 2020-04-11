import { Author } from 'book-app-shared/types/Author';

import { CreateActionWithContext, ReadActionWithContext } from '../constants/actionTypes';
import {
  composeMessage, addRepoPrefix,
  CREATE_ERROR, INVALID_STRUCTURE, STRUCTURE_GIVEN, ID_GIVEN, READ_ERROR, INVALID_ID, NOT_FOUND,
} from '../constants/errorMessages';
import { InvalidParametersError } from '../httpErrors/InvalidParametersError';
import { stringifyParams } from '../helpers/stringifyParams';
import { isValidId } from '../helpers/validators';

import { AuthorQueries } from '../db/queries/AuthorQueries';
import { createAuthorFromDbRow } from '../db/transformations/authorTransformation';
import { checkAuthorCreate } from '../checks/authorCheck';
import { NotFoundError } from '../httpErrors/NotFoundError';


export class AuthorRepository {
  static REPO_NAME = 'Author';

  static createAuthorIfNotExist: CreateActionWithContext<Author> = async (context, body): Promise<Author> => {
    const errPrefix = `${addRepoPrefix(AuthorRepository.REPO_NAME)} ${CREATE_ERROR}`;
    const errPostfix = `${STRUCTURE_GIVEN} ${JSON.stringify(body)}`;

    const { checked, message } = checkAuthorCreate(body);
    if (!checked) return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, message, errPostfix)));

    try {
      const params = stringifyParams(checked.name);
      const rowExists = await context.transaction.executeSingleOrNoResultQuery(AuthorQueries.getAuthorByName, params);
      if (rowExists) {
        return createAuthorFromDbRow(rowExists);
      }

      const rowCreate = await context.transaction.executeSingleResultQuery(AuthorQueries.createAuthor, params);
      return createAuthorFromDbRow(rowCreate);
    } catch (error) {
      console.error(error, error.message);
      return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, INVALID_STRUCTURE, errPostfix)));
    }
  };

  static readAuthorById: ReadActionWithContext<Author> = async (context, id): Promise<Author> => {
    const errPrefix = `${addRepoPrefix(AuthorRepository.REPO_NAME)} ${READ_ERROR}`;
    const errPostfix = `${ID_GIVEN} ${id}`;

    if (!isValidId(id)) return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, INVALID_ID, errPostfix)));
    try {
      const params = stringifyParams(id);
      const rowCreate = await context.transaction.executeSingleOrNoResultQuery(AuthorQueries.getAuthorById, params);
      if (rowCreate) {
        return createAuthorFromDbRow(rowCreate);
      }
      return Promise.reject(new NotFoundError(composeMessage(errPrefix, NOT_FOUND, errPostfix)));
    } catch (error) {
      console.error(error, error.message);
      return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, INVALID_STRUCTURE, errPostfix)));
    }
  };
}
