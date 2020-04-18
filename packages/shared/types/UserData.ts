import { UnknownType } from '../../backend/types/UnknownType';
import {
  isBoolean, isNullUndefinedOrType, isString, isStructure, isUndefinedOrType,
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

export const isUserDataCreate = (test: unknown): test is UserDataCreate => (
  isStructure<UnknownType<UserDataCreate>>(test, ['email', 'publicProfile'])
  && isString(test.email)
  && isBoolean(test.publicProfile)
  && isUndefinedOrType(test.password, isString)
  && isUndefinedOrType(test.name, isString)
  && isUndefinedOrType(test.description, isString)
  && isUndefinedOrType(test.image, isString)
);

export const isUserDataUpdate = (test: unknown): test is UserDataUpdateWithPassword => (
  isStructure<UnknownType<UserDataUpdateWithPassword>>(test)
  && isUndefinedOrType(test.publicProfile, isBoolean)
  && isNullUndefinedOrType(test.password, isString)
  && isNullUndefinedOrType(test.name, isString)
  && isNullUndefinedOrType(test.description, isString)
  && isNullUndefinedOrType(test.image, isString)
);
