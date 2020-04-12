import { isString } from '../helpers/typeChecks';

export interface Author {
  readonly id: number;
  readonly name: string;
}

export interface AuthorCreate {
  readonly name: string;
}

interface UnknownCreate {
  name: unknown;
}

export const isAuthorCreate = (test: unknown): test is AuthorCreate => {
  if (test
    && typeof test === 'object'
    && 'name' in test) {
    const structured = test as UnknownCreate;

    return isString(structured.name);
  }
  return false;
};
