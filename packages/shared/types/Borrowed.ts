import { UnknownType } from './others/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isNumber, isUndefined, isNull, isBoolean,
} from '../helpers/typeChecks';

export interface Borrowed {
  readonly id: number;
  readonly bookDataId: number;
  readonly created: Date;
  readonly returned: boolean;
  readonly userBorrowedId: number | null;
  readonly nonUserName: string | null;
  readonly comment: string | null;
  readonly until: Date | null;
}

export interface BorrowedCreate {
  readonly bookDataId: number;
  readonly userBorrowedId?: number;
  readonly nonUserName?: string;
  readonly comment?: string;
  readonly until?: string;
}

export interface BorrowedUpdate {
  readonly userBorrowedId?: number | null;
  readonly nonUserName?: string | null;
  readonly comment?: string | null;
  readonly until?: string | null;
  readonly returned?: boolean;
}

export const isBorrowedCreate: TypeCheckFunction<BorrowedCreate> = typeCheckFactory(
  (test): test is BorrowedCreate => (
    isStructure<UnknownType<BorrowedCreate>>(test, ['bookDataId'])
    && isNumber(test.bookDataId)
    && isUndefined.or(isNumber)(test.userBorrowedId)
    && isUndefined.or(isString)(test.nonUserName)
    && isUndefined.or(isString)(test.comment)
    && isUndefined.or(isString)(test.until)
  ),
);

export const isBorrowedUpdate: TypeCheckFunction<BorrowedUpdate> = typeCheckFactory(
  (test): test is BorrowedUpdate => (
    isStructure<UnknownType<BorrowedUpdate>>(test)
    && isUndefined.or(isNull).or(isNumber)(test.userBorrowedId)
    && isUndefined.or(isNull).or(isString)(test.nonUserName)
    && isUndefined.or(isNull).or(isString)(test.comment)
    && isUndefined.or(isNull).or(isString)(test.until)
    && isUndefined.or(isBoolean)(test.returned)
  ),
);
