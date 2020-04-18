import { Author } from 'book-app-shared/types/Author';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createAuthorFromDbRow: CreateFromDbRow<Author> = (row) => ({
  id: row.id,
  name: row.name,
});
