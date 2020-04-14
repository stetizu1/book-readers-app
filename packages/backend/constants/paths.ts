const apiPrefix = '/api/';
const idPostfix = '/:id';
const getAll = '-all';

export const path = {
  get:
    (what: string): string => `${apiPrefix}${what}${idPostfix}`,
  getAll:
    (what: string): string => `${apiPrefix}${what}${getAll}`,
  post:
    (what: string): string => `${apiPrefix}${what}`,
  put:
    (what: string): string => `${apiPrefix}${what}${idPostfix}`,
  delete:
    (what: string): string => `${apiPrefix}${what}${idPostfix}`,
};

export const author = 'author';
export const book = 'book';
export const bookData = 'book-data';
export const bookRequest = 'book-request';
export const borrowed = 'borrowed';
export const friendship = 'friendship';
export const genre = 'genre';
export const hasLabel = 'has-label';
export const label = 'label';
export const personalBookData = 'personal-book-data';
export const review = 'review';
export const userData = 'user';
