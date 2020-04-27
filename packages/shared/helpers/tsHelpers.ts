import { isUndefined } from './typeChecks';

/**
 * Returns keys of object as array of keyof object
 * @param obj - object whose keys will be mapped
 */
export const getKeys = <T extends object>(obj: T): (keyof T)[] => (
  Object.keys(obj) as (keyof T)[]
);

/**
 * Returns true for '1', 'true', 'y' and 'yes', false otherwise.
 * @param value - value tested
 */
export const stringToBoolean = (value: string): boolean => {
  const formattedValue = value.trim().toLocaleLowerCase();
  const truthy = ['1', 'true', 'y', 'yes'];
  return truthy.some((v) => v === formattedValue);
};

/**
 * Checks if some of given values is defined
 * @param values - values to check
 */
export const someOfValuesPresent = (...values: (unknown | undefined)[]): boolean => values.some((value) => !isUndefined(value));
