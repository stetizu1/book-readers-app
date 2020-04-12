export const isObject = (param: unknown): param is object => typeof param === 'object';

export const isString = (param: unknown): param is string => typeof param === 'string';

export const isNumber = (param: unknown): param is number => typeof param === 'number';

export const isBoolean = (param: unknown): param is boolean => typeof param === 'boolean';

export const isUndefined = (param: unknown): param is undefined => param === undefined;

export const isUndefinedOrString = (param: unknown): param is (undefined | string) => isUndefined(param) || isString(param);

export const isStructure = <T>(structure: unknown, required: string[]): structure is T => (
  (isObject(structure))
  && (required.find((param) => !(param in structure)) === undefined));


type CheckFunction<T> = (param: unknown) => param is T;

export const allItemsAre = <T>(arr: unknown[], checkFunction: CheckFunction<T>): arr is T[] => arr
  .find(
    (item) => !checkFunction((item)),
  ) === undefined;
