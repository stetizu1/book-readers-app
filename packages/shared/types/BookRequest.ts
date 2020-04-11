export interface BookRequest {
  readonly userId: number;
  readonly bookId: number;
  readonly comment?: string;
  readonly userBookingId?: number;
  readonly createdByBookingUser: boolean;
}

export interface BookRequestCreate {
  readonly userId: number;
  readonly bookId: number;
  readonly comment?: string;
  readonly userBookingId?: number;
  readonly createdByBookingUser: boolean;
}
