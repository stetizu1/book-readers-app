/**
 * Returns keys of object as array of keyof object
 * @param obj - object whose keys will be mapped
 */
export const getKeys = <T extends object>(obj: T): (keyof T)[] => (
  Object.keys(obj) as (keyof T)[]
);
