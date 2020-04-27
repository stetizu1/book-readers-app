import { BookCreate, isBookCreate } from 'book-app-shared/types/Book';

import { ExportedCheckFunction } from '../types/CheckResult';
import { executeCheckCreate } from '../helpers/checks/constructCheckResult';


export const checkBookCreate: ExportedCheckFunction<BookCreate> = (body, errPrefix, errPostfix) => (
  executeCheckCreate(body, errPrefix, errPostfix, isBookCreate)
);
