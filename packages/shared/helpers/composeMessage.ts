import { isUndefined } from './typeChecks';

/**
 * Connects given arguments with whitespace separator.
 * @param args - string or undefined values to join.
 */
export const composeMessage = (...args: (string | number | undefined)[]): string => (
  args
    .filter((arg) => !isUndefined(arg))
    .join(' ')
);
