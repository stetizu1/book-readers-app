import { isNumber, isStructure } from '../helpers/typeChecks';

export interface HasLabel {
  readonly bookDataId: number;
  readonly labelId: number;
}

export type HasLabelCreate = HasLabel;

interface UnknownCreate {
  bookDataId: unknown;
  labelId: unknown;
}

export const isHasLabelCreate = (test: unknown): test is HasLabelCreate => (
  isStructure<UnknownCreate>(test, ['userId', 'name'])
  && isNumber(test.bookDataId)
  && isNumber(test.labelId)
);
