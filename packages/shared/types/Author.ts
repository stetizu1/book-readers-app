import { UnknownType } from '../../backend/types/UnknownType';
import { isStructure, isString } from '../helpers/typeChecks';

export interface Author {
  readonly id: number;
  readonly name: string;
}

export interface AuthorCreate {
  readonly name: string;
}

export const isAuthorCreate = (test: unknown): test is AuthorCreate => (
  isStructure<UnknownType<AuthorCreate>>(test, ['name'])
  && isString(test.name)
);
