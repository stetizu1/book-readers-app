import { Author } from 'book-app-shared/types/Author';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/string-helpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkAuthorCreate } from '../checks/invalid/author';
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

  readAuthorById: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);
      return await context.executeSingleResultQuery(convertDbRowToAuthor, authorQueries.getAuthorById, id);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(authorRepository.name, param);
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
