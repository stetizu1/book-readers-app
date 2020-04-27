import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { RepositoryName } from '../constants/RepositoryName';
import { ConflictErrorMessage, PathErrorMessage } from '../constants/ErrorMessages';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/stringHelpers/constructMessage';
import { getHttpError } from '../helpers/errors/getHttpError';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkBookCreate } from '../checks/bookCheck';
import { bookQueries } from '../db/queries/bookQueries';
import { convertDbRowToBook, convertToBookWithAuthorIds } from '../db/transformations/bookTransformation';

import { authorRepository } from './AuthorRepository';

import { convertDbRowToWrittenBy } from '../db/transformations/authorTransformation';


interface BookRepository extends Repository {
  createBook: CreateActionWithContext<Book>;
  readBookById: ReadActionWithContext<BookWithAuthorIds>;
  readAllBooks: ReadAllActionWithContext<BookWithAuthorIds>;
}

export const bookRepository: BookRepository = {
  name: RepositoryName.book,

  createBook: async (context, loggedUserId, body) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRepository.name, body);

    const checked = checkBookCreate(body, errPrefix, errPostfix);

    const authors = await Promise.all(
      checked.authors.map((authorCreate) => authorRepository.createAuthorFromBookIfNotExist(context, loggedUserId, authorCreate)),
    );

    try {
      const existingBooks = await Promise.all(
        authors.map((author) => (
          context.executeSingleOrNoResultQuery(convertDbRowToBook, bookQueries.getBookByAuthorIdAndName, author.id, checked.name)
        )),
      );
      if (existingBooks.every((value) => !isNull(value))) {
        return Promise.reject(getHttpError.getConflictError(ConflictErrorMessage.bookExists, errPrefix, errPostfix));
      }

      const createdBook = await context.executeSingleResultQuery(convertDbRowToBook, bookQueries.createBook, checked.name);

      await Promise.all(authors.map((author) => (
        context.executeSingleResultQuery(convertDbRowToWrittenBy, bookQueries.createWrittenBy, createdBook.id, author.id)
      )));

      return createdBook;
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookById: async (context, loggedUserId, id) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRepository.name, id);

    if (!isValidId(id)) {
      return Promise.reject(getHttpError.getInvalidParametersError(PathErrorMessage.invalidId, errPrefix, errPostfix));
    }

    try {
      const book = await context.executeSingleResultQuery(convertDbRowToBook, bookQueries.getBookById, id);
      const writtenByArray = await context.executeQuery(convertDbRowToWrittenBy, bookQueries.getAuthorsIdsByBookId, id);

      return convertToBookWithAuthorIds(book, writtenByArray);
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBooks: async (context) => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRepository.name);

    try {
      const books = await context.executeQuery(convertDbRowToBook, bookQueries.getAllBooks);

      return await Promise.all(
        books.map(async (book) => {
          const writtenByArray = await context.executeQuery(convertDbRowToWrittenBy, bookQueries.getAuthorsIdsByBookId, book.id);
          return convertToBookWithAuthorIds(book, writtenByArray);
        }),
      );
    } catch (error) {
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
