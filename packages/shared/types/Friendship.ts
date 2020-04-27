import { UnknownType } from '../../backend/types/UnknownType';
import {
  TypeCheckFunction, typeCheckFactory,
  isStructure,
  isNumber, isBoolean,
} from '../helpers/typeChecks';

export interface Friendship {
  readonly fromUserId: number;
  readonly toUserId: number;
  readonly confirmed: boolean;
}

export interface FriendshipCreate {
  readonly toUserId: number;
}

export interface FriendshipUpdate {
  readonly confirmed: boolean;
}

export const isFriendshipCreate: TypeCheckFunction<FriendshipCreate> = typeCheckFactory(
  (test): test is FriendshipCreate => (
    isStructure<UnknownType<FriendshipCreate>>(test, ['toUserId'])
    && isNumber(test.toUserId)
  ),
);

export const isFriendshipUpdate: TypeCheckFunction<FriendshipUpdate> = typeCheckFactory(
  (test): test is FriendshipUpdate => (
    isStructure<UnknownType<FriendshipUpdate>>(test, ['confirmed'])
    && isBoolean(test.confirmed)
  ),
);
