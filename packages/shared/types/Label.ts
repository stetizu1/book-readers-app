import { UnknownType } from '../../backend/types/UnknownType';

import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isUndefined, isNull,
} from '../helpers/typeChecks';

export interface Label {
  readonly id: number;
  readonly userId: number;
  readonly name: string;
  readonly description: string | null;
}

export interface LabelCreate {
  readonly name: string;
  readonly description?: string;
}

export interface LabelUpdate {
  readonly name?: string;
  readonly description?: string | null;
}

export const isLabelCreate: TypeCheckFunction<LabelCreate> = typeCheckFactory(
  (test): test is LabelCreate => (
    isStructure<UnknownType<LabelCreate>>(test, ['name'])
    && isString(test.name)
    && isUndefined.or(isString)(test.description)
  ),
);

export const isLabelUpdate: TypeCheckFunction<LabelUpdate> = typeCheckFactory(
  (test): test is LabelUpdate => (
    isStructure<UnknownType<LabelUpdate>>(test)
    && isUndefined.or(isString)(test.name)
    && isNull.or(isUndefined).or(isString)(test.description)
  ),
);
