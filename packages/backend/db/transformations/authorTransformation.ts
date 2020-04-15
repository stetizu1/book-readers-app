import { Author } from 'book-app-shared/types/Author';

import { CreateFromDbRow } from '../createFromDbRow';


export const createAuthorFromDbRow: CreateFromDbRow<Author> = (row) => ({
  id: row.id,
  name: row.name,
});
