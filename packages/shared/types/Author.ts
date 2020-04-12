import { isStructure, isString } from '../helpers/typeChecks';

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

export const isAuthorCreate = (test: unknown): test is AuthorCreate => (
  isStructure<UnknownCreate>(test, ['name'])
  && isString(test.name)
);
