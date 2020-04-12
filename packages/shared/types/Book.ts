import { AuthorCreate, isAuthorCreate } from './Author';
import { allItemsAre, isString } from '../helpers/typeChecks';

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

export const isBookCreate = (test: unknown): test is BookCreate => {
  if (test
    && typeof test === 'object'
    && 'name' in test
    && 'authors' in test) {
    const structured = test as UnknownCreate;

    return isString(structured.name)
      && Array.isArray(structured.authors)
      && allItemsAre<AuthorCreate>(structured.authors, isAuthorCreate);
  }
  return false;
};
