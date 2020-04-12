import { isBoolean, isString, isUndefinedOrString } from '../helpers/typeChecks';

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

export const isUserDataCreate = (test: unknown): test is UserDataCreate => {
  if (test
    && typeof test === 'object'
    && 'email' in test
    && 'publicProfile' in test) {
    const structured = test as UnknownCreate;

    return isString(structured.email)
      && isBoolean(structured.publicProfile)
      && isUndefinedOrString(structured.password)
      && isUndefinedOrString(structured.name)
      && isUndefinedOrString(structured.description)
      && isUndefinedOrString(structured.image);
  }
  return false;
};
