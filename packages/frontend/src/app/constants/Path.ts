export enum MenuPath {
  home = '/',
  library = '/library',
  reviews = '/reviews',
  friends = '/friends',
  wishlist = '/wishlist',
  bookLoans = '/book-loans',
}

export enum UnauthorizedPath {
  register = '/register',
}

export enum BookLoanPath {
  borrowed = '/book-loans/borrowed',
  add = '/book-loans/add',
  detail = '/book-loans/detail',
  edit = '/book-loans/edit',
}

export enum FriendPath {
  friendAdd = '/friends/add'
}

export enum ReviewsPath {
  toOwnReviews = '/reviews/own'
}

export enum LibraryPath {
  bookAdd = '/library/add',
  bookEdit = '/library/edit',
  bookDetail = '/library/detail',
  labels = '/library/labels',
  labelsAdd = '/library/labels/add',
  labelsEdit = '/library/labels/edit',
}

export enum ProfilePath {
  profile = '/profile',
  profileEdit = '/profile/edit'
}

export enum WishlistPath {
  wishlistAdd = '/wishlist/add',
  wishlistDetail = '/wishlist/detail',
  wishlistEdit = '/wishlist/edit',
}

export const Path = {
  ...MenuPath,
  ...UnauthorizedPath,

  ...BookLoanPath,
  ...FriendPath,
  ...LibraryPath,
  ...ProfilePath,
  ...ReviewsPath,
  ...WishlistPath,
};
