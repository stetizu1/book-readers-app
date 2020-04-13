import { Book } from 'book-app-shared/types/Book';

import { CreateActionWithContext } from '../types/actionTypes';
import { ErrorMethod, getErrorPrefixAndPostfix } from '../constants/errorMessages';
import { stringifyParams } from '../helpers/stringifyParams';

import { BookQueries } from '../db/queries/BookQueries';
import { createBookFromDbRow } from '../db/transformations/bookTransformation';
import { checkBookCreate } from '../checks/bookCheck';
import { AuthorRepository } from './AuthorRepository';
import { processTransactionError } from '../helpers/getHttpError';


export class BookRepository {
  static REPO_NAME = 'Book';

  static createBook: CreateActionWithContext<Book> = async (context, body): Promise<Book> => {
    const { errPrefix, errPostfix } = getErrorPrefixAndPostfix(BookRepository.REPO_NAME, ErrorMethod.Create, undefined, body);

    const { checked, checkError } = checkBookCreate(body, errPrefix, errPostfix);
    if (!checked) return Promise.reject(checkError);

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
      return Promise.reject(processTransactionError(error, errPrefix, errPostfix));
    }
  };
}
