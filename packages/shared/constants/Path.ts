export enum PathPrefix {
  prefix = '/api/',
}

export enum PathPostfix {
  getAll = '-all',
}

export enum BasePath {
  author = 'author',
  book = 'book',
  bookData = 'book-data',
  bookRequest = 'book-request',
  borrowed = 'borrowed',
  friendship = 'friendship',
  genre = 'genre',
  hasLabel = 'has-label',
  label = 'label',
  login = 'login',
  personalBookData = 'personal-book-data',
  review = 'review',
  user = 'user',

}

export enum PathParam {
  param = ':param',
  secondParam = ':secondParam',
}

export enum PathSpecification {
  email = 'email',
  toUser = 'to-user',
  booked = 'booked',
  friendsData = 'friends-data',
}
