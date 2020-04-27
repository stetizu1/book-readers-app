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
import { convertDbRowToAuthor } from '../db/transformations/authorTransformation';
import { authorQueries } from '../db/queries/authorQueries';


interface AuthorRepository extends Repository {
  createAuthorFromBookIfNotExist: CreateActionWithContext<Author>;
  readAuthorById: ReadActionWithContext<Author>;
  readAllAuthors: ReadAllActionWithContext<Author>;
}

export const authorRepository: AuthorRepository = {
  name: RepositoryName.author,

  createAuthorFromBookIfNotExist: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(authorRepository.name, body);
    const authorCreate = checkAuthorCreate(body, errPrefix, errPostfix);

    try {
      const existingAuthor = await context.executeSingleOrNoResultQuery(
        convertDbRowToAuthor, authorQueries.getAuthorByName, authorCreate.name,
      );

      if (!isNull(existingAuthor)) {
        return existingAuthor;
      }

      return await context.executeSingleResultQuery(
        convertDbRowToAuthor, authorQueries.createAuthor, authorCreate.name,
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAuthorById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authorRepository.name, id);
    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      return await context.executeSingleResultQuery(convertDbRowToAuthor, authorQueries.getAuthorById, id);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllAuthors: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(authorRepository.name);

    try {
      return await context.executeQuery(convertDbRowToAuthor, authorQueries.getAllAuthors);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
