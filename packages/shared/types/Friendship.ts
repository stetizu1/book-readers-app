import { isNumber, isStructure } from '../helpers/typeChecks';

export interface Friendship {
  readonly fromUserId: number;
  readonly toUserId: number;
  readonly confirmed: boolean;
}

export interface FriendshipCreate {
  readonly fromUserId: number;
  readonly toUserId: number;
}

interface UnknownCreate {
  fromUserId: unknown;
  toUserId: unknown;
}

export const isFriendshipCreate = (test: unknown): test is FriendshipCreate => (
  isStructure<UnknownCreate>(test, ['fromUserId', 'toUserId'])
  && isNumber(test.fromUserId)
  && isNumber(test.toUserId)
);
