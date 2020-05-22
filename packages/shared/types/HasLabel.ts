import { UnknownType } from './others/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isNumber,
} from '../helpers/typeChecks';

export interface HasLabel {
  readonly bookDataId: number;
  readonly labelId: number;
}

export const isHasLabel: TypeCheckFunction<HasLabel> = typeCheckFactory(
  (test): test is HasLabel => (
    isStructure<UnknownType<HasLabel>>(test, ['bookDataId', 'labelId'])
    && isNumber(test.bookDataId)
    && isNumber(test.labelId)
  ),
);
