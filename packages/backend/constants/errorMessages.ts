export const ERROR_PROCESSING = 'Error being processed: ';

export const STRUCTURE_GIVEN = 'Structure given:';
export const ID_GIVEN = 'Id given:';

export const INVALID_STRUCTURE = 'Given object structure is not valid.';
export const INVALID_ID = 'Given id is not valid.';
export const INVALID_EMAIL = 'Given email is not valid.';
export const INVALID_DATE = 'Given Date is not valid.';
export const EMPTY_STRING = 'Empty string on required field given.';
export const FRIEND_SAME_ID_GIVEN = 'Given ids were the same. Please, find real friends';

export const TRANSACTION_ERROR = 'Unable to commit transaction.';
export const TRANSACTION_NOT_ACTIVE = 'Attempting to execute query on an inactive transaction.';
export const TRANSACTION_SINGLE_NOT_FOUND = 'Single result query failed to return a result when expected.';

export const CREATE_ERROR = 'Create error:';
export const READ_ERROR = 'Read error:';

// db
export const NOT_FOUND = 'Structure with given parameters not found.';
export const UNIQUE_VIOLATION = 'Structure with given parameters already exists.';
export const FOREIGN_KEY_VIOLATION = 'Some id you gave to the structure does not exist';

export const addRepoPrefix = (what: string): string => `${what} error:`;

export const composeMessage = (...args: (string | undefined)[]): string => args.join(' ');
