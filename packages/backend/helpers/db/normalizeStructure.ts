import { isObject, isString, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { getKeys } from 'book-app-shared/helpers/tsHelpers';

const normalizeCreateSimpleValue = <T>(value: T): T | undefined => {
  if (isString(value) && value === '') return undefined;
  return value;
};

const normalizeCreateOptionalObject = <T extends object>(object?: T): T | undefined => {
  if (!isUndefined(object)
    && Object.values(object).some(
      (value) => !isUndefined(normalizeCreateSimpleValue(value)),
    )
  ) return object;
  return undefined;
};

const normalizeCreateValue = <T>(value: T): T | undefined => {
  if (isObject(value)) return normalizeCreateOptionalObject(value);
  return normalizeCreateSimpleValue(value);
};

/**
 * Switch possibly empty parameters to undefined.
 * It is used to store empty data in database data as null.
 * @param obj - object to be normalized
 */
export const normalizeCreateObject = <T extends object>(obj: T): T => (
  getKeys(obj).reduce((result, key) => ({
    ...result,
    [key]: normalizeCreateValue(obj[key]),
  }), {}) as T
);


const normalizeUpdateValue = <T>(value: T): T | null => {
  if (isString(value) && value === '') return null;
  return value;
};

/**
 * Switch possibly empty parameters to null.
 * It is used to update empty data to null and recognise difference between undefined (no change) and null (delete column data).
 * @param obj - object to be normalized
 */
export const normalizeUpdateObject = <T extends object>(obj: T): T => (
  getKeys(obj).reduce((result, key) => ({
    ...result,
    [key]: normalizeUpdateValue(obj[key]),
  }), {}) as T
);
