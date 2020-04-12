import {
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';

export interface PersonalBookData {
  readonly bookDataId: number;
  readonly dateRead?: Date;
  readonly comment?: string;
}

export interface PersonalBookDataCreate {
  readonly bookDataId: number;
  readonly dateRead?: string;
  readonly comment?: string;
}

interface UnknownCreate {
  bookDataId: unknown;
  dateRead?: unknown;
  comment?: unknown;
}

export const isPersonalBookDataCreate = (test: unknown): test is PersonalBookDataCreate => (
  isStructure<UnknownCreate>(test, ['bookDataId'])
  && isNumber(test.bookDataId)
  && isUndefinedOrType(test.comment, isString)
  && isUndefinedOrType(test.dateRead, isString)
);
