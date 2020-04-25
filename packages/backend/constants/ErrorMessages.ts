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

export enum ForbiddenMessage {
  missingAuthHeader = 'Request is missing authorization header',
  unknownHeaderFormat = 'Given authorization header is in unknown format.',
  notVerified = 'Given verification token is invalid.',
  invalidTokenFormat = 'Given token has invalid format.',
  invalidGoogleToken = 'Given token is not a valid Google token.',
  userDoesNotExist = 'Given user does not exist',
  unqualifiedForAction = 'User is not qualified to make given action',
}

export enum CheckResultMessage {
  success = 'SUCCESS',

  invalidType = 'Given object structure is not valid.',
  invalidId = 'Some id in body is not valid.',
  invalidName = 'Given name is in invalid format. Use only allowed characters (alphabetical, ., -, \').',
  invalidEmail = 'Given email is not valid.',
  invalidDate = 'Given Date is not valid.',
  invalidIsbn = 'Given isbn is not valid.',
  invalidYear = 'Given year is not valid.',
  invalidStars = 'Given number of stars is not valid.',

  bookDataCanNotDeleteUser = 'You can not delete book data user.',
  requestCreatedByBookingNoneGiven = 'Book is set to be created by booking user, but none given.',
  requestNotCreatedByBookingButGiven = 'Book is set as not created by booking user, but booking user given.',
  requestSameIdGiven = 'Given ids were the same. If you buy yourself a book, please just add it to your library.',
  friendSameIdGiven = 'Given ids were the same. Please, find real friends.',
  friendInvalidConfirm = 'You can not cancel confirmation of friendship. Delete the friend instead.',
  borrowSameIdGiven = 'Given ids were the same. You should stop borrowing your books.',
  borrowInvalidReturned = 'Returned can not be updated to false. Returned is default false and once set true can not be changed back.',
}

export enum PathErrorMessage {
  invalidParameter = 'Parameter given in path is not valid.',
  invalidId = 'Id in path is not valid.',
}

export enum ConflictErrorMessage {
  friendExists = 'Friendship with given users already exist.',
  bookExists = 'Book with the same name and given authors already exist.',
  bookDataUserExists = 'User is already assigned to this book data.',
}

export enum TransactionErrorMessage {
  unableToCommit = 'Unable to commit transaction.',
  notActive = 'Attempting to execute query on an inactive transaction.'
}

// db
export enum DatabaseErrorMessage {
  notFound = 'Structure with given parameters not found.',
  uniqueViolation = 'Structure with given unique parameters already exists.',
  nullViolation = 'Structure has nullable required parameter.',
  foreignKeyViolation = 'Id you gave to the structure does not exist.',
  unknownPostgreSqlError = 'Unknown error occurred during transaction on database site.',
  unknown = 'Unknown error occurred during transaction.',
}
