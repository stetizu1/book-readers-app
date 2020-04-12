import {
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';

import { isFormat, Format } from './Format';
import { isReviewCreate, ReviewCreate } from './Review';
import { isPersonalBookDataCreate, PersonalBookDataCreate } from './PersonalBookData';


export interface BookData {
  readonly id: number;
  readonly bookId: number;
  readonly userId: number;
  readonly publisher?: string;
  readonly yearPublished?: string;
  readonly isbn?: string;
  readonly image?: string;
  readonly format?: Format;
  readonly genre?: string;
  readonly labels?: string[];
}

export interface BookDataCreate {
  readonly bookId: number;
  readonly userId: number;
  readonly publisher?: string;
  readonly yearPublished?: string;
  readonly isbn?: string;
  readonly image?: string;
  readonly format?: Format;

  readonly review?: ReviewCreate;
  readonly personalBookData?: PersonalBookDataCreate;
}

interface UnknownCreate {
  bookId: unknown;
  userId: unknown;
  publisher?: unknown;
  yearPublished?: unknown;
  isbn?: unknown;
  image?: unknown;
  format?: unknown;

  review?: unknown;
  personalBookData?: unknown;
}

export const isBookDataCreate = (test: unknown): test is BookDataCreate => (
  isStructure<UnknownCreate>(test, ['bookId', 'userId'])
  && isNumber(test.bookId)
  && isNumber(test.userId)
  && isUndefinedOrType(test.publisher, isString)
  && isUndefinedOrType(test.yearPublished, isString)
  && isUndefinedOrType(test.isbn, isString)
  && isUndefinedOrType(test.image, isString)
  && isUndefinedOrType(test.format, isFormat)
  && isUndefinedOrType(test.review, isReviewCreate)
  && isUndefinedOrType(test.review, isPersonalBookDataCreate)
);
