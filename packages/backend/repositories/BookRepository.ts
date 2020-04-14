import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix, INVALID_ID } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';
import { getHttpError, processTransactionError } from '../helpers/getHttpError';

import { BookQueries } from '../db/queries/BookQueries';
import { createBookFromDbRow, createBookWithAuthorsIdsFromDbRows } from '../db/transformations/bookTransformation';
import { checkBookCreate } from '../checks/bookCheck';
import { AuthorRepository } from './AuthorRepository';


export class BookRepository {
  static REPO_NAME = 'Book';

  static createBook: CreateActionWithContext<Book> = async (context, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBookCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

    try {
      const bookRow = await context.transaction.executeSingleResultQuery(BookQueries.createBook, stringifyParams(checked.name));
      const createdBook = createBookFromDbRow(bookRow);

      const createdAuthors = await Promise.all(
        checked.authors.map((authorCreate) => AuthorRepository.createAuthorIfNotExist(context, authorCreate)),
      );

      await Promise.all(createdAuthors.map((author) => (
        context.transaction.executeSingleResultQuery(BookQueries.createWrittenBy, stringifyParams(createdBook.id, author.id))
      )));

      return createdBook;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readBookById: ReadActionWithContext<BookWithAuthorIds> = async (context, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookRepository.REPO_NAME, ErrorMethod.Read, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID));
    }

    try {
      const row = await context.transaction.executeSingleOrNoResultQuery(BookQueries.getBookById, stringifyParams(id));
      const authorsIdsRows = await context.transaction.executeQuery(BookQueries.getAuthorsIdsByBookId, stringifyParams(id));
      if (row) {
        return createBookWithAuthorsIdsFromDbRows(row, authorsIdsRows);
      }
      return Promise.reject(getHttpError.getNotFoundError(errPrefix, errPostfix));
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };

  static readAllBooks: ReadAllActionWithContext<BookWithAuthorIds> = async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookRepository.REPO_NAME, ErrorMethod.ReadAll);

    try {
      const rows = await context.transaction.executeQuery(BookQueries.getAllBooks);

      return await Promise.all(
        rows.map(async (row) => {
          const authorsIdsRows = await context.transaction.executeQuery(BookQueries.getAuthorsIdsByBookId, stringifyParams(row.id));
          return createBookWithAuthorsIdsFromDbRows(row, authorsIdsRows);
        }),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
