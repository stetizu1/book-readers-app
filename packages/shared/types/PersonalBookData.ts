export interface PersonalBookData {
  readonly bookDataId: number;
  readonly dateRead: Date;
  readonly comment: string;
}

export interface PersonalBookDataCreate {
  readonly dateRead: Date;
  readonly comment: string;
}
