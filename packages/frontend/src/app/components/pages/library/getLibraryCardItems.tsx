import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { Format } from 'book-app-shared/types/enums/Format';
import { BookData, BookDataWithLabelIds, isBookDataWithLabelsIds } from 'book-app-shared/types/BookData';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { PageMessages } from 'app/messages/PageMessages';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { getCardWithItem } from 'app/components/common/blockCreators/getCardWithItem';
import { getStars } from 'app/components/common/blockCreators/getStars';
import { CardData } from 'app/components/common/CardComponent';
import { Label } from 'book-app-shared/types/Label';
import { getLabels } from 'app/components/common/blockCreators/getLabel';


const getTopLeftItems = (book: BookWithAuthorIds, authors: Author[], publisher: string | null): JSX.Element[] => {
  const result: JSX.Element[] = [];
  result.push(getCardWithItem<BookWithAuthorIds, 'name'>({
    value: book.name,
    bold: true,
  }));
  authors.forEach((author) => {
    result.push(getCardWithItem<Author, 'name'>({ value: author.name }));
  });
  if (!isNull(publisher)) {
    result.push(getCardWithItem<BookDataWithLabelIds, 'publisher'>({ value: publisher }));
  }
  return result;
};

const getBottomLeftItems = (labels: Label[], personalBookData: PersonalBookData | undefined): JSX.Element[] => {
  const result: JSX.Element[] = [];
  result.push(getLabels(labels));
  if (!isUndefined(personalBookData) && !isNull(personalBookData.comment)) {
    result.push(getCardWithItem<PersonalBookData, 'comment'>({ value: personalBookData.comment }));
  }
  return result;
};

const getTopRightItems = (format: Format | null, genre: Genre | null): JSX.Element[] => {
  const result: JSX.Element[] = [];
  if (!isNull(format)) {
    result.push(getCardWithItem<BookData, 'format'>({ value: format }));
  }
  if (!isNull(genre)) {
    result.push(getCardWithItem<Genre, 'name'>({ value: genre.name }));
  }
  return result;
};

const getBottomRightItems = (personalBookData: PersonalBookData | undefined, review: Review | undefined): JSX.Element[] => {
  const result: JSX.Element[] = [];
  if (!isUndefined(personalBookData) && !isNull(personalBookData.dateRead)) {
    result.push(getCardWithItem<PersonalBookData, 'dateRead'>({
      prefix: PageMessages.library.item.dateRead,
      value: personalBookData.dateRead,
    }));
  }
  if (!isUndefined(review) && !isNull(review.stars)) {
    result.push(getStars(review.stars));
  }
  return result;
};


export const getLibraryCardItems = (bookData: BookDataWithLabelIds | BookData, booksMap: IdMap<BookWithAuthorIds>, authorsMap: IdMap<Author>, genresMap: IdMap<Genre>, labelsMap: IdMap<Label>, reviewsMap: IdMapOptional<Review>, personalBookDataMap: IdMapOptional<PersonalBookData>): CardData => {
  const {
    id, format, publisher, bookId, genreId,
  } = bookData;

  const book = booksMap[bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);

  const labels = isBookDataWithLabelsIds(bookData) ? bookData.labelsIds.map((labelId) => labelsMap[labelId]) : [];

  const genre = !isNull(genreId) ? genresMap[genreId] : null;

  const personalBookData = personalBookDataMap[id];
  const review = reviewsMap[id];

  return {
    items: {
      left: {
        top: getTopLeftItems(book, authors, publisher),
        bottom: getBottomLeftItems(labels, personalBookData),
      },
      right: {
        top: getTopRightItems(format, genre),
        bottom: getBottomRightItems(personalBookData, review),
      },
    },
  };
};
