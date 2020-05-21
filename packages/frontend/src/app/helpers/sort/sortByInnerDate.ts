import { isNull } from 'book-app-shared/helpers/typeChecks';

export const sortByInnerDate = <T extends {}>(key: keyof T) => (t1: T, t2: T): 1 | 0 | -1 => {
  if (isNull(t1[key]) && isNull(t2[key])) return 0;
  if (isNull(t1[key])) return 1;
  if (isNull(t2[key])) return -1;
  const b1Date = new Date(String(t1[key]));
  const b2Date = new Date(String(t2[key]));
  if (b1Date > b2Date) return 1;
  if (b1Date < b2Date) return -1;
  return 0;
};
