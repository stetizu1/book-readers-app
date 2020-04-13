import {
  isBoolean, isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';


export interface BookRequest {
  readonly userId: number;
  readonly bookDataId: number;
  readonly createdByBookingUser: boolean;
  readonly comment?: string;
  readonly userBookingId?: number;
}

export interface BookRequestCreate {
  readonly userId: number;
  readonly bookDataId: number;
  readonly createdByBookingUser: boolean;
  readonly comment?: string;
  readonly userBookingId?: number;
}

interface UnknownCreate {
  userId: unknown;
  bookDataId: unknown;
  createdByBookingUser: unknown;
  comment?: unknown;
  userBookingId?: unknown;
}

export const isBookRequestCreate = (test: unknown): test is BookRequestCreate => (
  isStructure<UnknownCreate>(test, ['bookDataId', 'userId', 'createdByBookingUser'])
  && isNumber(test.bookDataId)
  && isNumber(test.userId)
  && isBoolean(test.createdByBookingUser)
  && isUndefinedOrType(test.comment, isString)
  && isUndefinedOrType(test.userBookingId, isNumber)
);
