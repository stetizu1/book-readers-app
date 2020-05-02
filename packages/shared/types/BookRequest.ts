import { UnknownType } from './others/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isNumber, isBoolean, isUndefined, isNull, isObject,
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
  readonly createdByBookingUser: boolean;
  readonly comment?: string;
  readonly userBookingId?: number;

  // more accurate check in book data
  readonly bookData: object; // BookDataCreateFromBookRequest
}

export interface BookRequestUpdate {
  readonly comment?: string | null;
  readonly userBookingId?: number | null;
  readonly createdByBookingUser?: boolean;
}

export const isBookRequestCreate: TypeCheckFunction<BookRequestCreate> = typeCheckFactory(
  (test): test is BookRequestCreate => (
    isStructure<UnknownType<BookRequestCreate>>(test, ['bookData', 'userId', 'createdByBookingUser'])
    && isNumber(test.userId)
    && isBoolean(test.createdByBookingUser)
    && isUndefined.or(isString)(test.comment)
    && isUndefined.or(isNumber)(test.userBookingId)
    && isObject(test.bookData)
  ),
);

export const isBookRequestUpdate: TypeCheckFunction<BookRequestUpdate> = typeCheckFactory(
  (test): test is BookRequestUpdate => (
    isStructure<UnknownType<BookRequestUpdate>>(test)
    && isUndefined.or(isNull).or(isString)(test.comment)
    && isUndefined.or(isNull).or(isNumber)(test.userBookingId)
    && isUndefined.or(isBookRequestUpdate)(test.createdByBookingUser)
  ),
);
