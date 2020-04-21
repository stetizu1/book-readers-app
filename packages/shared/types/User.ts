import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isBoolean, isUndefined, isNull,
} from '../helpers/typeChecks';

export interface User {
  readonly id: number;
  readonly email: string;
  readonly publicProfile: boolean;
  readonly name: string | null;
  readonly description: string | null;
  readonly image: string | null;
}

export interface UserCreate {
  readonly email: string;
  readonly publicProfile: boolean;
  readonly password?: string;
  readonly name?: string;
  readonly description?: string;
  readonly image?: string;
}

export interface UserUpdate {
  readonly publicProfile?: boolean;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly image?: string | null;
}

export interface UserUpdateWithPassword extends UserUpdate {
  readonly password?: string | null;
}

export const isUserCreate: TypeCheckFunction<UserCreate> = typeCheckFactory(
  (test): test is UserCreate => (
    isStructure<UnknownType<UserCreate>>(test, ['email', 'publicProfile'])
    && isString(test.email)
    && isBoolean(test.publicProfile)
    && isNull.or(isUndefined).or(isString)(test.password)
    && isNull.or(isUndefined).or(isString)(test.name)
    && isNull.or(isUndefined).or(isString)(test.description)
    && isNull.or(isUndefined).or(isString)(test.image)
  ),
);

export const isUserUpdate: TypeCheckFunction<UserUpdate> = typeCheckFactory(
  (test): test is UserUpdateWithPassword => (
    isStructure<UnknownType<UserUpdateWithPassword>>(test)
    && isUndefined.or(isBoolean)(test.publicProfile)
    && isNull.or(isUndefined).or(isString)(test.password)
    && isNull.or(isUndefined).or(isString)(test.name)
    && isNull.or(isUndefined).or(isString)(test.description)
    && isNull.or(isUndefined).or(isString)(test.image)
  ),
);
