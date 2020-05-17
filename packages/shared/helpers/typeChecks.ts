/**
 * Function checking whether parameter is given type. You can call 'or' on result to chain more type checking functions.
 */
export interface TypeCheckFunction<T> {
  (param: unknown): param is T;

  or<U>(checkFunction: TypeCheckFunction<U>): TypeCheckFunction<T | U>;
}

/**
 * Injects 'or' on callable type check.
 * @param check - function checking if parameter is given type.
 */
export const typeCheckFactory = <T>(check: (param: unknown) => param is T): TypeCheckFunction<T> => (
  Object.assign(check, {
    or: <U>(otherCheck: TypeCheckFunction<U>): TypeCheckFunction<T | U> => (
      typeCheckFactory<T | U>((param: unknown): param is T | U => check(param) || otherCheck(param))
    ),
  })
);

export const isUndefined: TypeCheckFunction<undefined> = typeCheckFactory(
  (param): param is undefined => param === undefined,
);

export const isNull: TypeCheckFunction<null> = typeCheckFactory(
  (param): param is null => param === null,
);

export const isObject: TypeCheckFunction<object> = typeCheckFactory(
  (param): param is object => !isNull(param) && typeof param === 'object',
);

export const isString: TypeCheckFunction<string> = typeCheckFactory(
  (param): param is string => typeof param === 'string',
);

export const isNumber: TypeCheckFunction<number> = typeCheckFactory(
  (param): param is number => typeof param === 'number',
);

export const isBoolean: TypeCheckFunction<boolean> = typeCheckFactory(
  (param): param is boolean => typeof param === 'boolean',
);

export const isDate: TypeCheckFunction<Date> = typeCheckFactory(
  (param): param is Date => param instanceof Date,
);

export const isStructure = <T>(structure: unknown, required: string[] = []): structure is T => (
  isObject(structure)
  && required.every((param) => (param in structure))
);


export const isArrayOfTypes = <T>(arr: unknown, checkFunction: TypeCheckFunction<T>): arr is T[] => Array.isArray(arr)
  && arr.every(
    (item) => checkFunction((item)),
  );

export const isNotUndefined = <T>(x: T | undefined): x is T => x !== undefined;
