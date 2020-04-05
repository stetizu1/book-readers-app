export interface Friendship {
  readonly fromUserId: number;
  readonly toUserId: number;
  readonly confirmed: boolean;
}

export interface FriendshipCreate {
  readonly fromUserId: number;
  readonly toUserId: number;
}
