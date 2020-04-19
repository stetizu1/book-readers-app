export const ERROR_PROCESSING = 'Error being processed:';

export const FORBIDDEN = 'Forbidden.';

export const INVALID_STRUCTURE = 'Given object structure is not valid.';
export const INVALID_ID = 'Given id is not valid.';
export const INVALID_EMAIL = 'Given email is not valid.';
export const INVALID_DATE = 'Given Date is not valid.';
export const EMPTY_STRING = 'Empty string on required field given.';
export const INVALID_ISBN = 'Given isbn is not valid.';
export const INVALID_YEAR = 'Given year is not valid.';
export const INVALID_STARS = 'Given number of stars is not valid.';


export const FRIEND_SAME_ID_GIVEN = 'Given ids were the same. Please, find real friends.';
export const FRIEND_INVALID_UNCONFIRM = 'You can not cancel confirmation of friendship. Delete friend instead.';
export const FRIEND_EXISTS = 'Frienship with given users already exist.';
export const BORROW_SAME_ID_GIVEN = 'Given ids were the same. You should stop borrowing your books.';
export const REQUEST_CREATED_BY_BOOKING_NONE_GIVEN = 'Book is set to be created by booking user, but none given.';
export const REQUEST_NOT_CREATED_BY_BOOKING_BUT_GIVEN = 'Book is set as not created by booking user, but booking user given.';
export const BOOK_DATA_CAN_NOT_DELETE_USER = 'You can not delete book data user.';
export const BOOK_DATA_CAN_NOT_REPLACE_USER = 'You can not replace an existing user.';


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

export const constructDeleteMessage = (repo: string, id: number): string => `${repo} with id ${id} successfully deleted.`;

export const composeMessage = (...args: (string | undefined)[]): string => args.join(' ');

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
