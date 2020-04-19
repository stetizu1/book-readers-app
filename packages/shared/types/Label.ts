import { UnknownType } from '../../backend/types/UnknownType';

import {
  isNullUndefinedOrType,
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';

export interface Label {
  readonly id: number;
  readonly userId: number;
  readonly name: string;
  readonly description: string | null;
}

export interface LabelCreate {
  readonly userId: number;
  readonly name: string;
  readonly description?: string;
}

export interface LabelUpdate {
  readonly name?: string;
  readonly description?: string | null;
}

export const isLabelCreate = (test: unknown): test is LabelCreate => (
  isStructure<UnknownType<LabelCreate>>(test, ['userId', 'name'])
  && isNumber(test.userId)
  && isString(test.name)
  && isUndefinedOrType(test.description, isString)
);

export const isLabelUpdate = (test: unknown): test is LabelUpdate => (
  isStructure<UnknownType<LabelUpdate>>(test)
  && isUndefinedOrType(test.name, isString)
  && isNullUndefinedOrType(test.description, isString)
);
