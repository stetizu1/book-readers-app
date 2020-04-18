import { UnknownType } from '../../backend/types/UnknownType';
import {
  isBoolean, isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';


export interface BookRequest {
  readonly userId: number;
  readonly bookDataId: number;
  readonly createdByBookingUser: boolean;
  readonly comment: string | null;
  readonly userBookingId: number | null;
}

export interface BookRequestCreate {
  readonly userId: number;
  readonly bookDataId: number;
  readonly createdByBookingUser: boolean;
  readonly comment?: string;
  readonly userBookingId?: number;
}

export const isBookRequestCreate = (test: unknown): test is BookRequestCreate => (
  isStructure<UnknownType<BookRequestCreate>>(test, ['bookDataId', 'userId', 'createdByBookingUser'])
  && isNumber(test.bookDataId)
  && isNumber(test.userId)
  && isBoolean(test.createdByBookingUser)
  && isUndefinedOrType(test.comment, isString)
  && isUndefinedOrType(test.userBookingId, isNumber)
);
