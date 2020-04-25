import { Author } from 'book-app-shared/types/Author';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkAuthorCreate } from '../checks/authorCheck';
import { authorQueries } from '../db/queries/authorQueries';
import { createAuthorFromDbRow } from '../db/transformations/authorTransformation';


interface AuthorRepository extends Repository {
  createAuthorFromBookIfNotExist: CreateActionWithContext<Author>;
  readAuthorById: ReadActionWithContext<Author>;
  readAllAuthors: ReadAllActionWithContext<Author>;
}

export const authorRepository: AuthorRepository = {
  name: RepositoryName.author,

  createAuthorFromBookIfNotExist: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(authorRepository.name, body);

    const checked = checkAuthorCreate(body, errPrefix, errPostfix);

    try {
      const existingAuthor = await context.executeSingleOrNoResultQuery(createAuthorFromDbRow, authorQueries.getAuthorByName, checked.name);
      if (isNull(existingAuthor)) {
        return await context.executeSingleResultQuery(createAuthorFromDbRow, authorQueries.createAuthor, checked.name);
      }
      return existingAuthor;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAuthorById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authorRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      return await context.executeSingleResultQuery(createAuthorFromDbRow, authorQueries.getAuthorById, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllAuthors: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(authorRepository.name);

    try {
      return await context.executeQuery(createAuthorFromDbRow, authorQueries.getAllAuthors);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
