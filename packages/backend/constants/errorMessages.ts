export const ERROR_PROCESSING = 'Error being processed:';

export const FORBIDDEN = 'Forbidden.';

export enum CheckResultValue {
  success = 'SUCCESS',
  invalidType = 'Given object structure is not valid.',
  invalidId = 'Some id in body is not valid.',
  invalidEmail = 'Given email is not valid.',
  invalidDate = 'Given Date is not valid.',
  invalidIsbn = 'Given isbn is not valid.',
  invalidYear = 'Given year is not valid.',
  invalidStars = 'Given number of stars is not valid.',

  bookDataCanNotDeleteUser = 'You can not delete book data user.',
  requestCreatedByBookingNoneGiven = 'Book is set to be created by booking user, but none given.',
  requestNotCreatedByBookingButGiven = 'Book is set as not created by booking user, but booking user given.',
  friendSameIdGiven = 'Given ids were the same. Please, find real friends.',
  friendInvalidConfirm = 'You can not cancel confirmation of friendship. Delete friend instead.',
  borrowSameIdGiven = 'Given ids were the same. You should stop borrowing your books.',
  borrowInvalidReturned = 'Returned can not be updated to false. Returned is default false and once set true can not be changed back.',

}

export const INVALID_ID = 'Id in parameter is not valid.';

export const FRIEND_EXISTS = 'Friendship with given users already exist.';
export const BOOK_ALREADY_EXISTS = 'Book you are trying to create already exists.';
export const BOOK_DATA_USER_EXISTS = 'You can not replace an existing user.';


export const TRANSACTION_ERROR = 'Unable to commit transaction.';
export const TRANSACTION_NOT_ACTIVE = 'Attempting to execute query on an inactive transaction.';

export enum ErrorMethod {
  Create = 'Create error:',
  Read = 'Read error:',
  ReadAll = 'Read all error:',
  Update = 'Update error:',
  Delete = 'Delete error:',
}

export enum ErrorParamGiven {
  Structure = 'Structure given:',
  Id = 'Id given:',
}

// db
export const UNKNOWN = 'Unknown error occurred during transaction.';
export const NOT_FOUND = 'Structure with given parameters not found.';
export const UNIQUE_VIOLATION = 'Structure with given unique parameters already exists.';
export const NULL_VIOLATION = 'Structure has nullable required parameter.';
export const FOREIGN_KEY_VIOLATION = 'Id you gave to the structure does not exist.';
export const UNKNOWN_POSTGRESQL_ERROR = 'Unknown error occurred during transaction on database site.';

export const composeMessage = (...args: (string | undefined)[]): string => args.join(' ');

export const constructDeleteMessage = (repo: string, id: number): string => composeMessage(repo, 'with id', String(id), 'successfully deleted.');

export const getErrorPrefixAndPostfix = (repoName: string, method: ErrorMethod, id?: number, body?: unknown): {
  errPrefix: string;
  errPostfix: string;
} => {
  const errPrefix = `${repoName} error: ${method}`;
  let errPostfix = '';

  if (method === ErrorMethod.Read || method === ErrorMethod.Delete) {
    errPostfix = composeMessage(ErrorParamGiven.Id, String(id));
  } else if (method === ErrorMethod.Create) {
    errPostfix = composeMessage(ErrorParamGiven.Structure, JSON.stringify(body));
  } else if (method === ErrorMethod.Update) {
    errPostfix = composeMessage(ErrorParamGiven.Id, String(id), ErrorParamGiven.Structure, JSON.stringify(body));
  }

  return {
    errPrefix,
    errPostfix,
  };
};
