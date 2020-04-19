import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isNumber,
} from '../helpers/typeChecks';

export interface HasLabel {
  readonly bookDataId: number;
  readonly labelId: number;
}

export type HasLabelCreate = HasLabel;

export const isHasLabelCreate: TypeCheckFunction<HasLabelCreate> = typeCheckFactory(
  (test): test is HasLabelCreate => (
    isStructure<UnknownType<HasLabelCreate>>(test, ['bookDataId', 'labelId'])
    && isNumber(test.bookDataId)
    && isNumber(test.labelId)
  ),
);
