import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isBoolean, isUndefined, isNull,
} from '../helpers/typeChecks';

export interface UserData {
  readonly id: number;
  readonly email: string;
  readonly publicProfile: boolean;
  readonly name: string | null;
  readonly description: string | null;
  readonly image: string | null;
}

export interface UserDataCreate {
  readonly email: string;
  readonly publicProfile: boolean;
  readonly password?: string;
  readonly name?: string;
  readonly description?: string;
  readonly image?: string;
}

export interface UserDataUpdateWithPassword extends UserDataUpdate {
  readonly password?: string | null;
}

export interface UserDataUpdate {
  readonly publicProfile?: boolean;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly image?: string | null;
}

export const isUserDataCreate: TypeCheckFunction<UserDataCreate> = typeCheckFactory(
  (test): test is UserDataCreate => (
    isStructure<UnknownType<UserDataCreate>>(test, ['email', 'publicProfile'])
    && isString(test.email)
    && isBoolean(test.publicProfile)
    && isNull.or(isUndefined).or(isString)(test.password)
    && isNull.or(isUndefined).or(isString)(test.name)
    && isNull.or(isUndefined).or(isString)(test.description)
    && isNull.or(isUndefined).or(isString)(test.image)
  ),
);

export const isUserDataUpdate: TypeCheckFunction<UserDataUpdate> = typeCheckFactory(
  (test): test is UserDataUpdateWithPassword => (
    isStructure<UnknownType<UserDataUpdateWithPassword>>(test)
    && isUndefined.or(isBoolean)(test.publicProfile)
    && isNull.or(isUndefined).or(isString)(test.password)
    && isNull.or(isUndefined).or(isString)(test.name)
    && isNull.or(isUndefined).or(isString)(test.description)
    && isNull.or(isUndefined).or(isString)(test.image)
  ),
);
