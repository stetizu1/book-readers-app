import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { isValidId } from 'book-app-shared/helpers/validators';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError } from '../helpers/getHttpError';
import { processTransactionError } from '../helpers/processTransactionError';

import { bookQueries } from '../db/queries/bookQueries';
import { createBookFromDbRow, createBookWithAuthorsIdsFromDbRows } from '../db/transformations/bookTransformation';
import { checkBookCreate } from '../checks/bookCheck';
import { authorRepository } from './AuthorRepository';


interface BookRepository extends Repository {
  createBook: CreateActionWithContext<Book>;
  readBookById: ReadActionWithContext<BookWithAuthorIds>;
  readAllBooks: ReadAllActionWithContext<BookWithAuthorIds>;
}

export const bookRepository: BookRepository = {
  name: 'Book',

  createBook: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookRepository.name, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBookCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const bookRow = await context.transaction.executeSingleResultQuery(bookQueries.createBook, stringifyParams(checked.name));
      const createdBook = createBookFromDbRow(bookRow);

      const createdAuthors = await Promise.all(
        checked.authors.map((authorCreate) => authorRepository.createAuthorIfNotExist(context, authorCreate)),
      );

      await Promise.all(createdAuthors.map((author) => (
        context.transaction.executeSingleResultQuery(bookQueries.createWrittenBy, stringifyParams(createdBook.id, author.id))
      )));

      return createdBook;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookRepository.name, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleResultQuery(bookQueries.getBookById, stringifyParams(id));
      const authorsIdsRows = await context.transaction.executeQuery(bookQueries.getAuthorsIdsByBookId, stringifyParams(id));

      return createBookWithAuthorsIdsFromDbRows(row, authorsIdsRows);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBooks: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(bookRepository.name, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(bookQueries.getAllBooks);

      return await Promise.all(
        rows.map(async (row) => {
          const authorsIdsRows = await context.transaction.executeQuery(bookQueries.getAuthorsIdsByBookId, stringifyParams(row.id));
          return createBookWithAuthorsIdsFromDbRows(row, authorsIdsRows);
        }),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
