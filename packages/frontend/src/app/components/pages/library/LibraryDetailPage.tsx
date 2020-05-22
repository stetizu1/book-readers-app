import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { BookData, isBookDataWithLabelsIds } from 'book-app-shared/types/BookData';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Author } from 'book-app-shared/types/Author';
import { Genre } from 'book-app-shared/types/Genre';
import { Label } from 'book-app-shared/types/Label';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { LibraryPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';
import { getLabelsContainer } from 'app/components/blocks/card-items/items-list/labels-container/getLabelsContainer';


interface StateProps {
  bookDataMap: IdMapOptional<BookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  labelsMap: IdMap<Label> | undefined;
  reviewsMap: IdMapOptional<Review> | undefined;
  personalBookDataMap: IdMapOptional<PersonalBookData> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.library;
const [bookDataSubHeader, personalBookDataSubHeader, reviewSubHeader, labelsSubHeader] = [messages.subHeaders.bookData, messages.subHeaders.personalBookData, messages.subHeaders.review, messages.subHeaders.labels];
const [bookDataLabels, personalBookDataLabels] = [messages.labels.bookData, messages.labels.personalBookData];

const BaseLibraryDetailPage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    bookDataMap,
    history,
    authorsMap,
    booksMap,
    genresMap,
    labelsMap,
    reviewsMap,
    personalBookDataMap,
  } = props;

  if (isUndefined(bookDataMap)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(labelsMap)
    || isUndefined(reviewsMap) || isUndefined(personalBookDataMap)) {
    return <UnknownError />;
  }

  const bookData = bookDataMap[pathId];
  if (isUndefined(bookData)) {
    return <NotFoundError />;
  }

  const {
    id, format, publisher, bookId, genreId, yearPublished, isbn,
  } = bookData;

  const book = booksMap[bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);

  const labels = isBookDataWithLabelsIds(bookData) ? bookData.labelsIds.map((labelId) => labelsMap[labelId]) : [];
  const genre = !isNull(genreId) ? genresMap[genreId] : null;
  const personalBookData = personalBookDataMap[id];
  const review = reviewsMap[id];


  const cardData: CardData = {
    header: getCardHeader(messages.detailHeader, BookSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getItem({ label: bookDataLabels.bookName, value: book.name }),
      getItems({ label: bookDataLabels.authorName, values: authors, structureKey: 'name' }),
      getItem({ label: bookDataLabels.format, value: format }),
      getItem({ label: bookDataLabels.publisher, value: publisher }),
      getItem({ label: bookDataLabels.yearPublished, value: yearPublished }),
      getItem({ label: bookDataLabels.isbn, value: isbn }),
      getItem({ label: bookDataLabels.genre, value: genre?.name }),

      getSubHeader(personalBookDataSubHeader),
      getItem({ label: personalBookDataLabels.dateRead, value: personalBookData?.dateRead }),
      getItem({ label: personalBookDataLabels.comment, value: personalBookData?.comment }),

      getSubHeader(reviewSubHeader),
      getRating(review?.stars),
      getItem({ value: review?.comment }),

      getSubHeader(labelsSubHeader),
      getLabelsContainer(labels),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.cancel,
        label: ButtonMessage.Back,
        onClick: (): void => {
          history.goBack();
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          history.push(withParameterPath(LibraryPath.bookEdit, bookData.id));
        },
      }),
    ],
  };

  return (
    <Card data={cardData} />
  );
};

export const LibraryDetailPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    bookDataMap: librarySelector.getAllBookDataMap(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    labelsMap: librarySelector.getAllLabelsMap(state),
    reviewsMap: librarySelector.getAllReviewsMap(state),
    personalBookDataMap: librarySelector.getAllPersonalBookDataMap(state),
  }),
)(withRouter(withLoading(
  BaseLibraryDetailPage,
  librarySelector.getAllBookDataStatus,
  librarySelector.getAllAuthorsStatus, librarySelector.getAllBooksStatus, librarySelector.getAllGenresStatus, librarySelector.getAllLabelsStatus,
  librarySelector.getAllReviewsStatus, librarySelector.getAllPersonalBookDataStatus,
)));
