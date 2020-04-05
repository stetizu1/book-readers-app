export interface Author {
  readonly id: number;
  readonly name: string;
}

export interface AuthorCreate {
  readonly name: string;
}
