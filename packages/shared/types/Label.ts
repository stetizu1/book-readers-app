import {
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';

export interface Label {
  readonly id: number;
  readonly userId: number;
  readonly name: string;
  readonly description?: string;
}

export interface LabelCreate {
  readonly userId: number;
  readonly name: string;
  readonly description?: string;
}

interface UnknownCreate {
  userId: unknown;
  name: unknown;
  description?: unknown;
}

export const isLabelCreate = (test: unknown): test is LabelCreate => (
  isStructure<UnknownCreate>(test, ['userId', 'name'])
  && isNumber(test.userId)
  && isString(test.name)
  && isUndefinedOrType(test.description, isString)
);
