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
  add = '/library/add',
  edit = '/library/edit',
  detail = '/library/detail',
  labels = '/library/labels',
  labelsAdd = '/library/labels/add',
  labelsEdit = '/library/labels/edit',
}

export enum FriendPath {
  add = '/friends/add'
}

export const Path = {
  ...MenuPath,
  ...UnauthorizedPath,
  ...ProfilePath,
  ...LibraryPath,
};
