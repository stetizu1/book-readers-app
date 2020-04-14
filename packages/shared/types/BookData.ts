import {
  isArrayOfTypes,
  isNumber, isObject, isString, isStructure, isUndefined, isUndefinedOrType,
} from '../helpers/typeChecks';

import { isFormat, Format } from './enums/Format';


export interface BookData {
  readonly id: number;
  readonly bookId: number;
  readonly userId?: number;
  readonly publisher?: string;
  readonly yearPublished?: string;
  readonly isbn?: string;
  readonly image?: string;
  readonly format?: Format;
  readonly genreId?: number;
}

export interface BookDataCreate {
  readonly bookId: number;
  readonly userId?: number;
  readonly publisher?: string;
  readonly yearPublished?: string;
  readonly isbn?: string;
  readonly image?: string;
  readonly format?: Format;

  readonly genreId?: number;
  readonly labelsIds?: number[];

  // safer check provided in their own repo, object for spread and empty check
  readonly review?: object; // Omit<ReviewCreate, 'bookDataId'>
  readonly personalBookData?: object; // Omit<PersonalBookDataCreate, 'bookDataId'>
}

interface UnknownCreate {
  bookId: unknown;
  userId?: unknown;
  publisher?: unknown;
  yearPublished?: unknown;
  isbn?: unknown;
  image?: unknown;
  format?: unknown;

  genreId?: unknown;
  labelsIds?: unknown;

  review?: unknown;
  personalBookData?: unknown;
}

export const isBookDataCreate = (test: unknown): test is BookDataCreate => (
  isStructure<UnknownCreate>(test, ['bookId'])
  && isNumber(test.bookId)
  && isUndefinedOrType(test.userId, isNumber)
  && isUndefinedOrType(test.publisher, isString)
  && isUndefinedOrType(test.yearPublished, isString)
  && isUndefinedOrType(test.isbn, isString)
  && isUndefinedOrType(test.image, isString)
  && isUndefinedOrType(test.format, isFormat)
  && isUndefinedOrType(test.genreId, isNumber)
  && (isUndefined(test.labelsIds)
    || isArrayOfTypes(test.labelsIds, isNumber))
  && isUndefinedOrType(test.review, isObject)
  && isUndefinedOrType(test.personalBookData, isObject)
);
