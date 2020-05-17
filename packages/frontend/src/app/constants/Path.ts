export enum MenuPath {
  home = '/',
  library = '/library',
  reviews = '/reviews',
  friends = '/friends',
  wishlist = '/wishlist',
  borrows = '/borrows',
}

export enum UnauthorizedPath {
  register = '/register',
}

export enum ProfilePath {
  profile = '/profile',
  profileEdit = '/profile/edit'
}

export enum LibraryPath {
  bookAdd = '/library/add',
  bookEdit = '/library/edit',
  bookDetail = '/library/detail',
  labels = '/library/labels',
  labelsAdd = '/library/labels/add',
  labelsEdit = '/library/labels/edit',
}

export enum FriendPath {
  friendAdd = '/friends/add'
}

export enum WishlistPath {
  wishlistAdd = '/wishlist/add',
  wishlistDetail = '/wishlist/detail',
  wishlistEdit = '/wishlist/edit',
}

export const Path = {
  ...MenuPath,
  ...UnauthorizedPath,
  ...ProfilePath,
  ...LibraryPath,
  ...FriendPath,
  ...WishlistPath,
};
