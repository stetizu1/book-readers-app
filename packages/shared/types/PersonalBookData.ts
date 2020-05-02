import { UnknownType } from './others/UnknownType';

import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isNumber, isUndefined, isNull,
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

export interface PersonalBookDataUpdate {
  readonly dateRead?: string | null;
  readonly comment?: string | null;
}

export const isPersonalBookDataCreate: TypeCheckFunction<PersonalBookDataCreate> = typeCheckFactory(
  (test): test is PersonalBookDataCreate => (
    isStructure<UnknownType<PersonalBookDataCreate>>(test, ['bookDataId'])
    && isNumber(test.bookDataId)
    && isUndefined.or(isString)(test.comment)
    && isUndefined.or(isString)(test.dateRead)
  ),
);

export const isPersonalBookDataUpdate: TypeCheckFunction<PersonalBookDataUpdate> = typeCheckFactory(
  (test): test is PersonalBookDataUpdate => (
    isStructure<UnknownType<PersonalBookDataUpdate>>(test)
    && isUndefined.or(isNull).or(isString)(test.comment)
    && isUndefined.or(isNull).or(isString)(test.dateRead)
  ),
);
