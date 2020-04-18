import { UnknownType } from '../../backend/types/UnknownType';
import {
  isNumber, isString, isStructure, isUndefinedOrType,
} from '../helpers/typeChecks';


export interface Review {
  readonly bookDataId: number;
  // at least one of following
  readonly stars: number | null;
  readonly comment: string | null;
}

export interface ReviewCreate {
  readonly bookDataId: number;
  readonly stars?: number;
  readonly comment?: string;
}


export const isReviewCreate = (test: unknown): test is ReviewCreate => (
  isStructure<UnknownType<ReviewCreate>>(test, ['bookDataId'])
  && isNumber(test.bookDataId)
  && isUndefinedOrType(test.stars, isNumber)
  && isUndefinedOrType(test.comment, isString)
);
