export interface Book {
  readonly id: number;
  readonly name: string;
  readonly authorIds: string[];
}

export interface BookCreate {
  readonly name: string;
}
