import {
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';

export interface Borrowed {
  readonly userId: number;
  readonly bookId: number;
  readonly created: Date;
  readonly userBorrowedId?: number;
  readonly nonUserName?: string;
  readonly comment?: string;
  readonly to?: Date;
  readonly returned: boolean;
}

export interface BorrowedCreate {
  readonly userId: number;
  readonly bookId: number;
  readonly userBorrowedId?: number;
  readonly nonUserName?: string;
  readonly comment?: string;
  readonly to?: string;
}

interface UnknownCreate {
  userId: unknown;
  bookId: unknown;
  userBorrowedId?: unknown;
  nonUserName?: unknown;
  comment?: unknown;
  to?: unknown;
}

export const isBorrowedCreate = (test: unknown): test is BorrowedCreate => (
  isStructure<UnknownCreate>(test, ['userId', 'bookId'])
  && isNumber(test.userId)
  && isNumber(test.bookId)
  && isUndefinedOrType(test.userBorrowedId, isNumber)
  && isUndefinedOrType(test.userBorrowedId, isString)
  && isUndefinedOrType(test.comment, isString)
  && isUndefinedOrType(test.to, isString)
);
