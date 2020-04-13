import { AuthorCreate, isAuthorCreate } from './Author';
import { isArrayOfTypes, isString, isStructure } from '../helpers/typeChecks';

export interface Book {
  readonly id: number;
  readonly name: string;
}

export interface BookWithAuthorIds extends Book {
  readonly authorIds: string[];
}

export interface BookCreate {
  readonly name: string;
  readonly authors: AuthorCreate[];
}

interface UnknownCreate {
  name: unknown;
  authors: unknown;
}

export const isBookCreate = (test: unknown): test is BookCreate => (
  isStructure<UnknownCreate>(test, ['name', 'authors'])
  && isString(test.name)
  && isArrayOfTypes(test.authors, isAuthorCreate)
);
