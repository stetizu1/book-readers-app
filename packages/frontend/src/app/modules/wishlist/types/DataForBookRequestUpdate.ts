import { BookRequestUpdate } from 'book-app-shared/types/BookRequest';
import { BookDataUpdate } from 'book-app-shared/types/BookData';

export interface DataForBookRequestUpdate {
  bookRequestUpdate: BookRequestUpdate;
  bookDataUpdate: BookDataUpdate;
}
