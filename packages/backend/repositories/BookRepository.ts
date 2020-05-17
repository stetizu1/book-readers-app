import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';

import { RepositoryName } from '../constants/RepositoryName';

import { Repository } from '../types/repositories/Repository';
import { CreateActionWithContext, ReadActionWithContext, ReadAllActionWithContext } from '../types/actionTypes';

import { getErrorPrefixAndPostfix } from '../helpers/string-helpers/constructMessage';
import { processTransactionError } from '../helpers/errors/processTransactionError';

import { checkParameterId } from '../checks/parameter/checkParameterId';
import { checkBookCreate } from '../checks/invalid/book';
import { bookQueries } from '../db/queries/bookQueries';
import { convertDbRowToBook, convertToBookWithAuthorIds } from '../db/transformations/bookTransformation';

import { authorRepository } from './AuthorRepository';

import { convertDbRowToWrittenBy } from '../db/transformations/authorTransformation';
import { checkConflictBook } from '../checks/conflict/book';


interface BookRepository extends Repository {
  createBook: CreateActionWithContext<Book>;
  readBookById: ReadActionWithContext<BookWithAuthorIds>;
  readAllBooks: ReadAllActionWithContext<BookWithAuthorIds>;
}

export const bookRepository: BookRepository = {
  name: RepositoryName.book,

  createBook: async (context, loggedUserId, body) => {
    try {
      const bookCreate = checkBookCreate(body);
      const authors = await Promise.all(
        bookCreate.authors.map(
          (authorCreate) => authorRepository.createAuthorFromBookIfNotExist(context, loggedUserId, authorCreate),
        ),
      );
      const isNotExisting = await checkConflictBook.create(context, authors, bookCreate.name);
      if (!isNotExisting) { // is existing
        return await context.executeSingleResultQuery(convertDbRowToBook, bookQueries.getBookByName, bookCreate.name);
      }

      const book = await context.executeSingleResultQuery(convertDbRowToBook, bookQueries.createBook, bookCreate.name);
      await Promise.all(authors.map((author) => (
        context.executeSingleResultQuery(convertDbRowToWrittenBy, bookQueries.createWrittenBy, book.id, author.id)
      )));
      return book;
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.create(bookRepository.name, body);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readBookById: async (context, loggedUserId, param) => {
    try {
      const id = checkParameterId(param);

      const book = await context.executeSingleResultQuery(convertDbRowToBook, bookQueries.getBookById, id);
      const writtenByArray = await context.executeQuery(convertDbRowToWrittenBy, bookQueries.getAuthorsIdsByBookId, id);
      return convertToBookWithAuthorIds(book, writtenByArray);
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.read(bookRepository.name, param);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },

  readAllBooks: async (context) => {
    try {
      const books = await context.executeQuery(convertDbRowToBook, bookQueries.getAllBooks);

      return await Promise.all(
        books.map(async (book) => {
          const writtenByArray = await context.executeQuery(convertDbRowToWrittenBy, bookQueries.getAuthorsIdsByBookId, book.id);
          return convertToBookWithAuthorIds(book, writtenByArray);
        }),
      );
    } catch (error) {
      const { errPrefix, errPostfix } = getErrorPrefixAndPostfix.readAll(bookRepository.name);
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  },
};
