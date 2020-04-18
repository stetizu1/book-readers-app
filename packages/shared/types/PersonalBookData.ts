import { UnknownType } from '../../backend/types/UnknownType';

import {
  isNumber, isString, isStructure, isUndefinedOrType,
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

export const isPersonalBookDataCreate = (test: unknown): test is PersonalBookDataCreate => (
  isStructure<UnknownType<PersonalBookDataCreate>>(test, ['bookDataId'])
  && isNumber(test.bookDataId)
  && isUndefinedOrType(test.comment, isString)
  && isUndefinedOrType(test.dateRead, isString)
);
