import { UnknownType } from '../../backend/types/UnknownType';
import {
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';

export interface Borrowed {
  readonly userId: number;
  readonly bookDataId: number;
  readonly created: Date;
  readonly returned: boolean;
  readonly userBorrowedId: number | null;
  readonly nonUserName: string | null;
  readonly comment: string | null;
  readonly until: Date | null;
}

export interface BorrowedCreate {
  readonly userId: number;
  readonly bookDataId: number;
  readonly userBorrowedId?: number;
  readonly nonUserName?: string;
  readonly comment?: string;
  readonly until?: string;
}

export const isBorrowedCreate = (test: unknown): test is BorrowedCreate => (
  isStructure<UnknownType<BorrowedCreate>>(test, ['userId', 'bookDataId'])
  && isNumber(test.userId)
  && isNumber(test.bookDataId)
  && isUndefinedOrType(test.userBorrowedId, isNumber)
  && isUndefinedOrType(test.userBorrowedId, isString)
  && isUndefinedOrType(test.comment, isString)
  && isUndefinedOrType(test.until, isString)
);
