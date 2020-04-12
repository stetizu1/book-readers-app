import {
  isBoolean, isString, isStructure, isUndefinedOrString,
} from '../helpers/typeChecks';

export interface UserData {
  readonly id: number;
  readonly email: string;
  readonly publicProfile: boolean;
  readonly name?: string;
  readonly description?: string;
  readonly image?: string;
}

export interface UserDataCreate {
  readonly email: string;
  readonly publicProfile: boolean;
  readonly password?: string;
  readonly name?: string;
  readonly description?: string;
  readonly image?: string;
}

interface UnknownCreate {
  email: unknown;
  publicProfile: unknown;
  password?: unknown;
  name?: unknown;
  description?: unknown;
  image?: unknown;
}

export const isUserDataCreate = (test: unknown): test is UserDataCreate => (
  isStructure<UnknownCreate>(test, ['email', 'publicProfile'])
  && isString(test.email)
  && isBoolean(test.publicProfile)
  && isUndefinedOrString(test.password)
  && isUndefinedOrString(test.name)
  && isUndefinedOrString(test.description)
  && isUndefinedOrString(test.image)
);
