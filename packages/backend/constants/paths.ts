const apiPrefix = '/api/';
const idPostfix = '/:id';
const getAll = '-all';

type WrapPath = (path: Path) => string;

interface MakePath {
  get: WrapPath;
  getAll: WrapPath;
  post: WrapPath;
  put: WrapPath;
  delete: WrapPath;
}

export const makePath: MakePath = {
  get: (path) => `${apiPrefix}${path}${idPostfix}`,
  getAll: (path) => `${apiPrefix}${path}${getAll}`,
  post: (path) => `${apiPrefix}${path}`,
  put: (path) => `${apiPrefix}${path}${idPostfix}`,
  delete: (path) => `${apiPrefix}${path}${idPostfix}`,
};

export enum Path {
  author = 'author',
  book = 'book',
  bookData = 'book-data',
  bookRequest = 'book-request',
  borrowed = 'borrowed',
  friendship = 'friendship',
  genre = 'genre',
  hasLabel = 'has-label',
  label = 'label',
  personalBookData = 'personal-book-data',
  review = 'review',
  userData = 'user',
}
