import { Book } from 'book-app-shared/types/Book';

import { CreateActionWithContext } from '../constants/actionTypes';
import {
  composeMessage, addRepoPrefix,
  CREATE_ERROR, INVALID_STRUCTURE, STRUCTURE_GIVEN, UNIQUE_VIOLATION,
} from '../constants/errorMessages';
import { isUniqueViolation } from '../db/errors';
import { ConflictError } from '../httpErrors/ConflictError';
import { InvalidParametersError } from '../httpErrors/InvalidParametersError';
import { stringifyParams } from '../helpers/stringifyParams';

import { BookQueries } from '../db/queries/BookQueries';
import { createBookFromDbRow } from '../db/transformations/bookTransformation';
import { checkBookCreate } from '../checks/bookCheck';
import { AuthorRepository } from './AuthorRepository';


export class BookRepository {
  static REPO_NAME = 'Book';

  static createBook: CreateActionWithContext<Book> = async (context, body): Promise<Book> => {
    const errPrefix = `${addRepoPrefix(BookRepository.REPO_NAME)} ${CREATE_ERROR}`;
    const errPostfix = `${STRUCTURE_GIVEN} ${JSON.stringify(body)}`;

    const { checked, message } = checkBookCreate(body);
    if (!checked) return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, message, errPostfix)));

    const params = stringifyParams(checked.name);

    try {
      const bookRow = await context.transaction.executeSingleResultQuery(BookQueries.createBook, params);
      const createdBook = createBookFromDbRow(bookRow);

      const createdAuthors = await Promise.all(
        checked.authors.map((authorCreate) => AuthorRepository.createAuthorIfNotExist(context, authorCreate)),
      );

      await Promise.all(createdAuthors.map((author) => {
        const writtenParams = stringifyParams(createdBook.id, author.id);
        return context.transaction.executeSingleResultQuery(BookQueries.createWrittenBy, writtenParams);
      }));

      return createdBook;
    } catch (error) {
      console.error(error, error.message);

      if (isUniqueViolation(error)) {
        return Promise.reject(new ConflictError(composeMessage(errPrefix, UNIQUE_VIOLATION, errPostfix)));
      }
      return Promise.reject(new InvalidParametersError(composeMessage(errPrefix, INVALID_STRUCTURE, errPostfix)));
    }
  };
}
