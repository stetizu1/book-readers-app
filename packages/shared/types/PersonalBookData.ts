import { UnknownType } from '../../backend/types/UnknownType';

import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isNumber, isUndefined,
} from '../helpers/typeChecks';

export interface PersonalBookData {
  readonly bookDataId: number;
  readonly dateRead: Date | null;
  readonly comment: string | null;
}

export interface PersonalBookDataCreate {
  readonly bookDataId: number;
  readonly dateRead?: string;
  readonly comment?: string;
}

export const isPersonalBookDataCreate: TypeCheckFunction<PersonalBookDataCreate> = typeCheckFactory(
  (test: unknown): test is PersonalBookDataCreate => (
    isStructure<UnknownType<PersonalBookDataCreate>>(test, ['bookDataId'])
    && isNumber(test.bookDataId)
    && isUndefined.or(isString)(test.comment)
    && isUndefined.or(isString)(test.dateRead)
  ),
);
