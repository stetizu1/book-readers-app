export interface TypeCheckFunction<T> {
  (param: unknown): param is T;

  or<U>(checkFunction: TypeCheckFunction<U>): TypeCheckFunction<T | U>;
}

/**
 * injects or on callable check
 * @param check
 */
export const typeCheckFactory = <T>(check: (param: unknown) => param is T): TypeCheckFunction<T> => (
  Object.assign(check, {
    or: <U>(otherCheck: TypeCheckFunction<U>): TypeCheckFunction<T | U> => (
      typeCheckFactory<T | U>((param: unknown): param is T | U => check(param) || otherCheck(param))
    ),
  })
);

export const isObject: TypeCheckFunction<object> = typeCheckFactory(
  (param): param is object => typeof param === 'object',
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

export const isUndefined: TypeCheckFunction<undefined> = typeCheckFactory(
  (param): param is undefined => param === undefined,
);

export const isNull: TypeCheckFunction<null> = typeCheckFactory(
  (param): param is null => param === null,
);


export const isStructure = <T>(structure: unknown, required: string[] = []): structure is T => (
  isObject(structure)
  && required.every((param) => (param in structure))
);


export const isArrayOfTypes = <T>(arr: unknown, checkFunction: TypeCheckFunction<T>): arr is T[] => Array.isArray(arr)
  && arr.every(
    (item) => checkFunction((item)),
  );
