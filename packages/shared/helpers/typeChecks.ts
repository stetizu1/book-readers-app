export const isString = (param): param is string => typeof param === 'string';

export const isBoolean = (param): param is boolean => typeof param === 'boolean';

export const isUndefined = (param): param is undefined => param === undefined;

export const isUndefinedOrString = (param): param is (undefined | string) => isUndefined(param) || isString(param);

type CheckFunction<T> = (param: unknown) => param is T;

export const allItemsAre = <T>(arr: unknown[], checkFunction: CheckFunction<T>): arr is T[] => arr
  .find(
    (item: unknown) => !checkFunction((item)),
  ) === undefined;
