import { getKeys } from 'book-app-shared/helpers/tsHelpers';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

const mergeValue = <TValue>(oldValue: TValue, newValue: TValue): TValue => (
  (isUndefined(newValue)) ? oldValue : newValue
);

/**
 * Merges original object with update data to create right parameters for query
 * @param originalObject - object to update
 * @param newObject - update data
 */
export const merge = <TObject extends object>(originalObject: Required<TObject>, newObject: TObject): TObject => (
  getKeys(originalObject).reduce((result, key) => ({
    ...result,
    [key]: mergeValue(originalObject[key], newObject[key]),
  }), {}) as TObject
);
