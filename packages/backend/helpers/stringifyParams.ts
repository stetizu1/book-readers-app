export const stringifyParams = (...params: Array<string | number | boolean | Date | null | undefined>): Array<string | null> => (
  params.map((param) => {
    if (param === undefined || param === null) return null;
    if (param instanceof Date) return param.toISOString();
    if (Array.isArray(param)) return `{${String(param)}}`;
    return String(param);
  })
);
