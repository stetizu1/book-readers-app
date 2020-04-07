export interface Author {
  readonly id: number;
  readonly name: string;
}

export interface AuthorCreate {
  readonly name: string;
}

export const isAuthorCreate = (test: unknown): test is AuthorCreate => (
  test
  && typeof test === 'object'
  && 'name' in test
  && typeof (test as { name: unknown }).name === 'string'
);
