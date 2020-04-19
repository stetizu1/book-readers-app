import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isString, isNumber, isUndefined, isNull,
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

export interface ReviewUpdate {
  readonly stars?: number | null;
  readonly comment?: string | null;
}


export const isReviewCreate: TypeCheckFunction<ReviewCreate> = typeCheckFactory(
  (test): test is ReviewCreate => (
    isStructure<UnknownType<ReviewCreate>>(test, ['bookDataId'])
    && isNumber(test.bookDataId)
    && isUndefined.or(isNumber)(test.stars)
    && isUndefined.or(isString)(test.comment)
  ),
);

export const isReviewUpdate: TypeCheckFunction<ReviewUpdate> = typeCheckFactory(
  (test): test is ReviewUpdate => (
    isStructure<UnknownType<ReviewCreate>>(test)
    && isUndefined.or(isNull).or(isNumber)(test.stars)
    && isUndefined.or(isNull).or(isString)(test.comment)
  ),
);
