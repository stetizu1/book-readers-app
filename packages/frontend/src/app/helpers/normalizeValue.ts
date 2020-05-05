import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

export const normalizeValue = <T, >(value: T | null | undefined, defaultValue: T): T => (
  isNull.or(isUndefined)(value) ? defaultValue : value
);
