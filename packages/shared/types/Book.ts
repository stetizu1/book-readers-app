import { AuthorCreate, isAuthorCreate } from './Author';

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

export const isBookCreate = (test: unknown): test is BookCreate => {
  if (test
    && typeof test === 'object'
    && 'name' in test
    && 'authors' in test) {
    const structured = test as {
      name: unknown;
      authors: unknown;
    };
    return typeof structured.name === 'string'
      && Array.isArray(structured.authors)
      && (
        structured.authors.find((author: unknown) => !isAuthorCreate(author))
      ) === undefined;
  }
  return false;
};
