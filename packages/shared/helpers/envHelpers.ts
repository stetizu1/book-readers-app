import { isUndefined } from './typeChecks';

/**
 * Returns true for '1', 'true', 'y' and 'yes' and false for '0', 'false', 'n' and 'no'. Throws error with given message otherwise.
 * @param value - value tested
 * @param errMessage - message for error on invalid value
 */
export const envToBoolean = (value: string | undefined, errMessage: string): boolean => {
  if (isUndefined(value)) throw new Error(errMessage);

  const formattedValue = value.trim().toLocaleLowerCase();
  const truthy = ['1', 'true', 'y', 'yes'];
  const falsy = ['0', 'false', 'n', 'no'];

  const isTrue = truthy.some((v) => v === formattedValue);
  if (isTrue) return true;

  const isFalse = falsy.some((v) => v === formattedValue);
  if (isFalse) return false;

  throw new Error(errMessage);
};


/**
 * Returns given value, if it is string and passes test if given.
 * Throws error with given message otherwise.
 * @param value - value tested
 * @param errMessage - message for error on invalid value
 * @param regExp - test on string format
 */
export const envToStringRequired = (value: string | undefined, errMessage: string, regExp?: RegExp): string => {
  if (isUndefined(value) || (!isUndefined(regExp) && !regExp.test(value))) {
    throw new Error(errMessage);
  }
  return value;
};

/**
 * Returns given value, if it is string and passes test if given. Returns default value if given value is undefined.
 * Throws error with given message otherwise.
 * @param value - value tested
 * @param defaultValue - value returned for undefined first value
 * @param errMessage - message for error on invalid value
 * @param regExp - test on string format
 */
export const envToStringWithDefault = (value: string | undefined, defaultValue: string, errMessage: string, regExp?: RegExp): string => {
  if (isUndefined(value)) {
    return defaultValue;
  }
  if (!isUndefined(regExp) && !regExp.test(value)) {
    throw new Error(errMessage);
  }
  return value;
};

/**
 * Returns given value, if it is integer. Returns default value if given value is undefined.
 * Throws error with given message otherwise.
 * @param value - value tested
 * @param defaultValue - value returned for undefined first value
 * @param errMessage - message for error on invalid value
 */
export const envToIntegerWithDefault = (value: string | undefined, defaultValue: number, errMessage: string): number => {
  if (isUndefined(value)) {
    return defaultValue;
  }
  const numValue = Number(value);
  if (!Number.isInteger(numValue)) {
    throw new Error(errMessage);
  }
  return numValue;
};
