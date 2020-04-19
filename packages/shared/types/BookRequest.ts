import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isNumber, isBoolean, isUndefined,
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

export const isBookRequestCreate: TypeCheckFunction<BookRequestCreate> = typeCheckFactory(
  (test: unknown): test is BookRequestCreate => (
    isStructure<UnknownType<BookRequestCreate>>(test, ['bookDataId', 'userId', 'createdByBookingUser'])
    && isNumber(test.bookDataId)
    && isNumber(test.userId)
    && isBoolean(test.createdByBookingUser)
    && isUndefined.or(isString)(test.comment)
    && isUndefined.or(isNumber)(test.userBookingId)
  ),
);
