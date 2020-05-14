import { BookData, BookDataUpdate, BookDataWithLabelIds } from '../../types/BookData';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertBookDataToBookDataUpdate: ConvertToUpdate<BookDataWithLabelIds | BookData, BookDataUpdate> = (original) => ({
  userId: original.userId,
  publisher: original.publisher,
  yearPublished: original.yearPublished,
  isbn: original.isbn,
  image: original.image,
  format: original.format,
  genreId: original.genreId,
  labelsIds: 'labelsIds' in original ? original.labelsIds : [],
});
