import { BookCreate } from 'book-app-shared/types/Book';
import { BookDataCreate } from 'book-app-shared/types/BookData';

export interface DataForBookDataCreate {
  bookCreate: BookCreate;
  bookDataCreate: Partial<BookDataCreate>;
}
