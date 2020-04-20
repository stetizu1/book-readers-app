import { isDate, isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

type RequiredParameters = string | null;

type AcceptableParameters = RequiredParameters | number | boolean | Date | undefined;

/**
 * Reformat given parameters to string and null, to be used for query.
 * @param params - parameters to reformat
 */
export const stringifyParams = (...params: AcceptableParameters[]): RequiredParameters[] => (
  params.map((param) => {
    if (isUndefined.or(isNull)(param)) {
      return null;
    }
    if (isDate(param)) {
      return param.toISOString();
    }
    if (Array.isArray(param)) {
      return `{${String(param)}}`;
    }
    return String(param);
  })
);
