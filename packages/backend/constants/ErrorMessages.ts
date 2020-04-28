export enum PrefixMessage {
  errorProcessed = 'Error being processed:',
}

export enum PostfixMessage {
  error = 'error:',
}

export enum ErrorMethodMessage {
  Create = 'Create error:',
  Read = 'Read error:',
  ReadAll = 'Read all error:',
  Update = 'Update error:',
  Delete = 'Delete error:',
}

export enum ErrorParamGivenMessage {
  Structure = 'Structure given:',
  Param = 'Parameter given:',
}

export enum Success {
  checkSuccess = 'SUCCESS'
}

export enum InvalidParametersErrorMessage {
  invalidPathId = 'Id in path is not valid.',
  invalidPathEmail = 'Email given in path is not valid.',

  invalidType = 'Given object structure is not valid.',
  invalidId = 'Some id in body is not valid.',
  invalidName = 'Given name is in invalid format. Use only allowed characters (alphabetical, ., -, \').',
  invalidEmail = 'Given email is not valid.',
  invalidDate = 'Given Date is not valid.',
  invalidIsbn = 'Given isbn is not valid.',
  invalidYear = 'Given year is not valid.',
  invalidStars = 'Given number of stars is not valid.',

  bookDataCanNotDeleteUser = 'You can not delete book data user.',
  borrowInvalidReturned = 'Returned can not be updated to false. Returned is default false and once set true can not be changed back.',
  requestCreatedByBookingNoneGiven = 'Book is set to be created by booking user, but none given.',
  requestCreatedByBookingTryToSetOn = 'You can only set creating from booking user to false, to set it visible to user, not otherwise.',
  requestNotCreatedByBookingButGiven = 'Book is set as not created by booking user, but booking user given.',
  requestSameIdGiven = 'Given ids were the same. If you buy yourself a book, please just add it to your library.',
  friendInvalidConfirm = 'You can not cancel confirmation of friendship. Delete the friend instead.',
  userNoVerificationGiven = 'You have to provide user\'s password or google token for verification.'
}

export enum ForbiddenErrorMessage {
  missingAuthHeader = 'Request is missing authorization header.',
  unknownHeaderFormat = 'Given authorization header is in unknown format.',
  notVerified = 'Given verification token is invalid.',
  invalidTokenFormat = 'Given token has invalid format.',
  invalidGoogleToken = 'Given token is not a valid Google token.',
  userDoesNotExist = 'Given user does not exist.',
  notQualifiedForAction = 'User is not qualified to make given action.',
  emailsNotMatch = 'Email given for registration did not match with given email.'
}

export enum NotFoundErrorMessage {
  notFound = 'Structure with given parameters not found.',
}

export enum ConflictErrorMessage {
  uniqueViolation = 'Structure with given unique parameters already exists.',
  nullViolation = 'Structure has nullable required parameter.',
  foreignKeyViolation = 'Id you gave to the structure does not exist.',
  unknownPostgreSqlError = 'Unknown error occurred during transaction.',

  friendSameIdGiven = 'Given ids were the same. Please, find real friends.',
  friendExists = 'Friendship with given users already exist.',
  bookExists = 'Book with the same name and given authors already exist.',
  bookDataUserExists = 'User is already assigned to this book data.',
  borrowNotYourBook = 'Given book id was not yours. You should stop borrowing someone else\'s books.',
  borrowSameIdGiven = 'Given ids were the same. You should stop borrowing to you.',
  borrowDeleteNotFromYourBook = 'You can not delete borrow of someone else.'
}

export enum ServerErrorMessage {
  unableToCommit = 'Unable to commit transaction.',
  notActive = 'Attempting to execute query on an inactive transaction.',
  internalServerError = 'An internal server error occurred. Try it later.',
  unknown = 'Unknown error occurred during transaction.',
}
