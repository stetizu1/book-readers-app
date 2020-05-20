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

export enum BookLoansPath {
  bookLoansAdd = '/book-loans/add',
  bookLoansEdit = '/book-loans/edit',
  bookLoansDetail = '/book-loans/detail',
  borrowed = '/book-loans/borrowed',
  borrowedDetail = '/book-loans/borrowed/detail',
}

export enum FriendsPath {
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

  ...BookLoansPath,
  ...FriendsPath,
  ...LibraryPath,
  ...ProfilePath,
  ...ReviewsPath,
  ...WishlistPath,
};
