export const ERROR_PROCESSING = 'Error being processed: ';

export const STRUCTURE_GIVEN = 'Structure:';

export const INVALID_STRUCTURE = 'Given object structure is not valid.';
export const EMPTY_STRING = 'Empty string on required field given.';

export const TRANSACTION_ERROR = 'Unable to commit transaction.';
export const TRANSACTION_NOT_ACTIVE = 'Attempting to execute query on an inactive transaction.';
export const TRANSACTION_SINGLE_NOT_FOUND = 'Single result query failed to return a result when expected.';

export const REPO_ERROR_PREFIX = (what: string): string => `${what} error:`;

export const CREATE_ERROR = 'Create error:';

export const UNIQUE_VIOLATION = 'Structure with given parameters already exists.';

export const composeMessage = (...args: (string | undefined)[]): string => args.join(' ');
