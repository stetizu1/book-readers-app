export interface Borrowed {
  readonly userId: number;
  readonly bookId: number;
  readonly created: Date;
  readonly userBorrowedId?: number;
  readonly nonUserName?: string;
  readonly comment?: string;
  readonly to?: Date;
  readonly returned: boolean;
}

export interface BorrowedCreate {
  readonly userId: number;
  readonly bookId: number;
  readonly userBorrowedId?: number;
  readonly nonUserName?: string;
  readonly comment?: string;
  readonly to?: Date;
}
