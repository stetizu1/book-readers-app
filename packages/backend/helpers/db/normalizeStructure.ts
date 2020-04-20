import { isObject, isString, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { getKeys } from 'book-app-shared/helpers/tsHelpers';

type NormalizeValue = <T>(value: T) => T | null | undefined;

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

const normalizeCreateValue: NormalizeValue = <T>(value: T): T | undefined => {
  if (isObject(value)) return normalizeCreateOptionalObject(value);
  return normalizeCreateSimpleValue(value);
};

const normalizeUpdateValue: NormalizeValue = <T>(value: T): T | null => {
  if (isString(value) && value === '') return null;
  return value;
};

const normalizeValue = (toNormalize: unknown, normalizer: NormalizeValue): unknown => {
  if (isObject(toNormalize)) {
    return getKeys(toNormalize).reduce((result, key) => ({
      ...result,
      [key]: normalizer(toNormalize[key]),
    }), {});
  }
  return normalizer(toNormalize);
};


/**
 * Switch possibly empty parameters to undefined.
 * It is used to store empty data in database data as null.
 * @param toBeNormalized - object or value to be normalized
 */
export const normalizeCreateObject = (toBeNormalized: unknown): unknown => (
  normalizeValue(toBeNormalized, normalizeCreateValue)
);

/**
 * Switch possibly empty parameters to null.
 * It is used to update empty data to null and recognise difference between undefined (no change) and null (delete column data).
 * @param toBeNormalized - object or value to be normalized
 */
export const normalizeUpdateObject = (toBeNormalized: unknown): unknown => (
  normalizeValue(toBeNormalized, normalizeUpdateValue)
);
