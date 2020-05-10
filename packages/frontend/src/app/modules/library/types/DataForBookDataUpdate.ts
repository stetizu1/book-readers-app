import { BookDataUpdate } from 'book-app-shared/types/BookData';
import { ReviewUpdate } from 'book-app-shared/types/Review';
import { PersonalBookDataUpdate } from 'book-app-shared/types/PersonalBookData';

export interface DataForBookDataUpdate {
  bookDataUpdate: BookDataUpdate;
  reviewUpdate: ReviewUpdate;
  personalBookDataUpdate: PersonalBookDataUpdate;
}
