import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

export const stringifyParams = (...params: (string | number | boolean | Date | null | undefined)[]): (string | null)[] => (
  params.map((param) => {
    if (isUndefined.or(isNull)(param)) return null;
    if (param instanceof Date) return param.toISOString();
    if (Array.isArray(param)) return `{${String(param)}}`;
    return String(param);
  })
);
