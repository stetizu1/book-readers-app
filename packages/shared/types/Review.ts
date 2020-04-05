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
