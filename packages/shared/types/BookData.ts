import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isArrayOfTypes,
  isString, isNumber, isObject, isUndefined, isNull,
} from '../helpers/typeChecks';

import { isFormat, Format } from './enums/Format';


export interface BookData {
  readonly id: number;
  readonly bookId: number;
  readonly userId: number | null;
  readonly publisher: string | null;
  readonly yearPublished: string | null;
  readonly isbn: string | null;
  readonly image: string | null;
  readonly format: Format | null;
  readonly genreId: number | null;
}

export interface BookDataWithLabelIds extends BookData {
  readonly labelsIds: number[];
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

export interface BookDataUpdate {
  readonly userId?: number | null;
  readonly publisher?: string | null;
  readonly yearPublished?: string | null;
  readonly isbn?: string | null;
  readonly image?: string | null;
  readonly format?: Format | null;

  readonly genreId?: number | null;
  readonly labelsIds?: number[];
}

export const isBookDataCreate: TypeCheckFunction<BookDataCreate> = typeCheckFactory(
  (test: unknown): test is BookDataCreate => (
    isStructure<UnknownType<BookDataCreate>>(test, ['bookId'])
    && isNumber(test.bookId)
    && isUndefined.or(isNumber)(test.userId)
    && isUndefined.or(isString)(test.publisher)
    && isUndefined.or(isString)(test.yearPublished)
    && isUndefined.or(isString)(test.isbn)
    && isUndefined.or(isString)(test.image)
    && isUndefined.or(isFormat)(test.format)
    && isUndefined.or(isNumber)(test.genreId)
    && (isUndefined(test.labelsIds)
      || isArrayOfTypes(test.labelsIds, isNumber))
    && isUndefined.or(isObject)(test.review)
    && isUndefined.or(isObject)(test.personalBookData)
  ),
);

export const isBookDataUpdate: TypeCheckFunction<BookDataUpdate> = typeCheckFactory(
  (test: unknown): test is BookDataUpdate => (
    isStructure<UnknownType<BookDataUpdate>>(test)
    && isUndefined.or(isNumber)(test.userId)
    && isUndefined.or(isString).or(isNull)(test.publisher)
    && isUndefined.or(isString).or(isNull)(test.yearPublished)
    && isUndefined.or(isString).or(isNull)(test.isbn)
    && isUndefined.or(isString).or(isNull)(test.image)
    && isUndefined.or(isFormat).or(isNull)(test.format)
    && isUndefined.or(isNumber).or(isNull)(test.genreId)
    && (isUndefined.or(isNull)(test.labelsIds)
      || isArrayOfTypes(test.labelsIds, isNumber)
    )
  ),
);
