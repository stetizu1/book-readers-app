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
  editProfile = '/profile/edit'
}

export enum LibraryPath {
  editBookData = '/library/edit'
}

export const Path = {
  ...MenuPath,
  ...UnauthorizedPath,
  ...ProfilePath,
  ...LibraryPath,
};
