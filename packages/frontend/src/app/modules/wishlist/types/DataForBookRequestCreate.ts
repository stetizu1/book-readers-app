import { BookCreate } from 'book-app-shared/types/Book';
import { BookRequestCreate } from 'book-app-shared/types/BookRequest';

export interface DataForBookRequestCreate {
  bookCreate: BookCreate;
  bookRequestCreate: BookRequestCreate;
}
