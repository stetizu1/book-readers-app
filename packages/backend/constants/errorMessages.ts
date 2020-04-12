export const ERROR_PROCESSING = 'Error being processed: ';

export const FORBIDDEN = 'Forbidden.';

export const INVALID_STRUCTURE = 'Given object structure is not valid.';
export const INVALID_ID = 'Given id is not valid.';
export const INVALID_EMAIL = 'Given email is not valid.';
export const INVALID_DATE = 'Given Date is not valid.';
export const EMPTY_STRING = 'Empty string on required field given.';
export const FRIEND_SAME_ID_GIVEN = 'Given ids were the same. Please, find real friends';

export const TRANSACTION_ERROR = 'Unable to commit transaction.';
export const TRANSACTION_NOT_ACTIVE = 'Attempting to execute query on an inactive transaction.';
export const TRANSACTION_SINGLE_NOT_FOUND = 'Single result query failed to return a result when expected.';

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
export const UNKNOWN = 'Unknown error occured during transaction.';
export const NOT_FOUND = 'Structure with given parameters not found.';
export const UNIQUE_VIOLATION = 'Structure with given parameters already exists.';
export const FOREIGN_KEY_VIOLATION = 'Id you gave to the structure does not exist.';

export const getErrorPrefixAndPostfix = (repoName: string, method: ErrorMethod, id?: number, body?: unknown): {
  errPrefix: string;
  errPostfix: string;
} => {
  const errPrefix = `${repoName} error: ${method}`;
  let errPostfix = '';

  if (method === ErrorMethod.Read || method === ErrorMethod.Delete || method === ErrorMethod.Update) {
    errPostfix += `${ErrorParamGiven.Id} ${String(id)}`;
  }
  if (method === ErrorMethod.Create || method === ErrorMethod.Update) {
    errPostfix += `${ErrorParamGiven.Structure} ${JSON.stringify(body)}`;
  }

  return {
    errPrefix,
    errPostfix,
  };
};


export const composeMessage = (...args: (string | undefined)[]): string => args.join(' ');
