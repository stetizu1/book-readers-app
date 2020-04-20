import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ConflictErrorMessage, PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { stringifyParams } from '../helpers/stringHelpers/stringifyParams';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkBookCreate } from '../checks/bookCheck';
import { bookQueries } from '../db/queries/bookQueries';
import { createBookFromDbRow, createBookWithAuthorsIdsFromDbRows } from '../db/transformations/bookTransformation';

import { authorRepository } from './AuthorRepository';


interface BookRepository extends Repository {
  createBook: CreateActionWithContext<Book>;
  readBookById: ReadActionWithContext<BookWithAuthorIds>;
  readAllBooks: ReadAllActionWithContext<BookWithAuthorIds>;
}

export const bookRepository: BookRepository = {
  name: RepositoryName.book,

  createBook: async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRepository.name, body);

    const { checked, checkError } = checkBookCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const authors = await Promise.all(
        checked.authors.map((authorCreate) => authorRepository.createAuthorFromBookIfNotExist(context, authorCreate)),
      );

      const existingBooks = await Promise.all(
        authors.map((author) => (
          context.executeSingleOrNoResultQuery(bookQueries.getBookByAuthorIdAndName, stringifyParams(author.id, checked.name))
        )),
      );
      if (existingBooks.every((value) => !isNull(value))) {
        return Promise.reject(getHttpError.getConflictError(ConflictErrorMessage.bookExists, errPrefix, errPostfix));
      }

      const bookRow = await context.executeSingleResultQuery(bookQueries.createBook, stringifyParams(checked.name));
      const createdBook = createBookFromDbRow(bookRow);

      await Promise.all(authors.map((author) => (
        context.executeSingleResultQuery(bookQueries.createWrittenBy, stringifyParams(createdBook.id, author.id))
      )));

      return createdBook;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookById: async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, PathErrorMessage.invalidId));
    }

    try {
      const row = await context.executeSingleResultQuery(bookQueries.getBookById, stringifyParams(id));
      const authorsIdsRows = await context.executeQuery(bookQueries.getAuthorsIdsByBookId, stringifyParams(id));

      return createBookWithAuthorsIdsFromDbRows(row, authorsIdsRows);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBooks: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRepository.name);

    try {
      const rows = await context.executeQuery(bookQueries.getAllBooks);

      return await Promise.all(
        rows.map(async (row) => {
          const authorsIdsRows = await context.executeQuery(bookQueries.getAuthorsIdsByBookId, stringifyParams(row.id));
          return createBookWithAuthorsIdsFromDbRows(row, authorsIdsRows);
        }),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
