import { Author } from 'book-app-shared/types/Author';
import { isNull } from 'book-app-shared/helpers/typeChecks';

import { Transaction } from '../../types/transaction/Transaction';

import { convertDbRowToBook } from '../../db/transformations/bookTransformation';
import { bookQueries } from '../../db/queries/bookQueries';

interface CheckConflictBook {
  create: (context: Transaction, authors: Author[], bookName: string) => Promise<boolean>;
}

export const checkConflictBook: CheckConflictBook = {
  create: async (context, authors, bookName) => {
    const booksWithSameNameAndAuthor = await Promise.all(authors.map((author) => (
      context.executeSingleOrNoResultQuery(convertDbRowToBook, bookQueries.getBookByNameAndAuthorId, bookName, author.id)
    )));
    // false if book has the same name and all the same authors
    return !booksWithSameNameAndAuthor.every((value) => !isNull(value));
  },
};
