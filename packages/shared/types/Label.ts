import { UnknownType } from '../../backend/types/UnknownType';

import {
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

export const isLabelCreate = (test: unknown): test is LabelCreate => (
  isStructure<UnknownType<LabelCreate>>(test, ['userId', 'name'])
  && isNumber(test.userId)
  && isString(test.name)
  && isUndefinedOrType(test.description, isString)
);
