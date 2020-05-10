import { BookData } from 'book-app-shared/types/BookData';
import { Book } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { Label } from 'book-app-shared/types/Label';
import { Genre } from 'book-app-shared/types/Genre';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

export interface CurrentBookData {
  bookData: BookData;
  book: Book;
  authors: Author[];
  labels: Label[];
  genre: Genre | null;
  review: Review | null;
  personalBookData: PersonalBookData | null;
}
