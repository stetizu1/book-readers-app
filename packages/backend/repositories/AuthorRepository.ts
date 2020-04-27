import { Author } from 'book-app-shared/types/Author';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkParameterId } from '../checks/other/checkParameterId';
import { checkAuthorCreate } from '../checks/authorChecks';
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
    try {
      const authorCreate = checkAuthorCreate(body);
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
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(authorRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAuthorById: async (context, loggedUserId, id) => {
    try {
      checkParameterId(id);
      return await context.executeSingleResultQuery(convertDbRowToAuthor, authorQueries.getAuthorById, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authorRepository.name, id);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllAuthors: async (context) => {
    try {
      return await context.executeQuery(convertDbRowToAuthor, authorQueries.getAllAuthors);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(authorRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
