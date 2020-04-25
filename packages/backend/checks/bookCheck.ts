import { BookCreate, isBookCreate } from 'book-app-shared/types/Book';

import { CheckFunction } from '../types/CheckResult';
import { checkCreate } from '../helpers/checks/constructCheckResult';


export const checkBookCreate: CheckFunction<BookCreate> = (body, errPrefix, errPostfix) => (
  checkCreate(isBookCreate, undefined, body, errPrefix, errPostfix)
);
