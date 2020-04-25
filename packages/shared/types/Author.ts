import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString,
} from '../helpers/typeChecks';

export interface Author {
  readonly id: number;
  readonly name: string;
}

export interface WrittenBy {
  readonly authorId: number;
  readonly bookId: number;
}

export interface AuthorCreate {
  readonly name: string;
}

export const isAuthorCreate: TypeCheckFunction<AuthorCreate> = typeCheckFactory(
  (test): test is AuthorCreate => (
    isStructure<UnknownType<AuthorCreate>>(test, ['name'])
    && isString(test.name)
  ),
);
