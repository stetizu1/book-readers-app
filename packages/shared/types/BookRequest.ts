import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isNumber, isBoolean, isUndefined, isNull,
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

export interface BookRequestUpdate {
  readonly comment?: string | null;
  readonly userBookingId?: number | null;
}

export const isBookRequestCreate: TypeCheckFunction<BookRequestCreate> = typeCheckFactory(
  (test): test is BookRequestCreate => (
    isStructure<UnknownType<BookRequestCreate>>(test, ['bookDataId', 'userId', 'createdByBookingUser'])
    && isNumber(test.bookDataId)
    && isNumber(test.userId)
    && isBoolean(test.createdByBookingUser)
    && isUndefined.or(isString)(test.comment)
    && isUndefined.or(isNumber)(test.userBookingId)
  ),
);

export const isBookRequestUpdate: TypeCheckFunction<BookRequestUpdate> = typeCheckFactory(
  (test): test is BookRequestUpdate => (
    isStructure<UnknownType<BookRequestUpdate>>(test)
    && isUndefined.or(isNull).or(isString)(test.comment)
    && isUndefined.or(isNull).or(isNumber)(test.userBookingId)
  ),
);
