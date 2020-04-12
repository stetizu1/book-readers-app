import {
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';


export interface Review {
  readonly bookDataId: number;
  // at least one of following
  readonly stars?: number;
  readonly comment?: string;
}

export interface ReviewCreate {
  readonly bookDataId: number;
  readonly stars?: number;
  readonly comment?: string;
}

interface UnknownCreate {
  bookDataId: number;
  stars?: unknown;
  comment?: unknown;
}

export const isReviewCreate = (test: unknown): test is ReviewCreate => (
  isStructure<UnknownCreate>(test, ['bookDataId'])
  && isNumber(test.bookDataId)
  && isUndefinedOrType(test.stars, isNumber)
  && isUndefinedOrType(test.comment, isString)
);
