type CheckFunction<T> = (param: unknown) => param is T;

export const isObject: CheckFunction<object> = (param): param is object => typeof param === 'object';

export const isString: CheckFunction<string> = (param): param is string => typeof param === 'string';

export const isNumber: CheckFunction<number> = (param): param is number => typeof param === 'number';

export const isBoolean: CheckFunction<boolean> = (param): param is boolean => typeof param === 'boolean';

export const isUndefined: CheckFunction<undefined> = (param): param is undefined => param === undefined;

export const isUndefinedOrType = <T>(param: unknown, checkFunction: CheckFunction<T>): param is (undefined | T) => isUndefined(param) || checkFunction(param);

export const isStructure = <T>(structure: unknown, required: string[]): structure is T => (
  (isObject(structure))
  && (required.find((param) => !(param in structure)) === undefined));


export const allItemsAre = <T>(arr: unknown[], checkFunction: CheckFunction<T>): arr is T[] => arr
  .find(
    (item) => !checkFunction((item)),
  ) === undefined;
