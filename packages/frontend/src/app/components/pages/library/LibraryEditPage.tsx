import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { Format } from 'book-app-shared/types/enums/Format';
import { Label } from 'book-app-shared/types/Label';
import { BookData, BookDataUpdate } from 'book-app-shared/types/BookData';
import { PersonalBookData, PersonalBookDataUpdate } from 'book-app-shared/types/PersonalBookData';
import { Review, ReviewUpdate } from 'book-app-shared/types/Review';
import { Genre } from 'book-app-shared/types/Genre';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';

import { htmlRegExp } from 'book-app-shared/constants/regexp';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isEmptyObject } from 'book-app-shared/helpers/validators';
import { convertBookDataToBookDataUpdate } from 'book-app-shared/helpers/convert-to-update/bookData';
import { convertPersonalBookDataToPersonalBookDataUpdate } from 'book-app-shared/helpers/convert-to-update/personalBookData';
import { convertReviewToReviewUpdate } from 'book-app-shared/helpers/convert-to-update/review';

import { PageMessages } from 'app/messages/PageMessages';
import { FormatMessage } from 'app/messages/FormatMessage';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';

import { librarySelector } from 'app/modules/library/librarySelector';
import { libraryAction } from 'app/modules/library/libraryAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getMultiSelectFormItem } from 'app/components/blocks/card-items/items-form/multi-select/getMultiSelectFormItem';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getRatingFormItem } from 'app/components/blocks/card-items/items-form/rating/getRatingFormItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getNumberSelectNullableFormItem } from 'app/components/blocks/card-items/items-form/select/number-nullable/getNumberSelectNullableFormItem';
import { getFormatSelectNullableFormItem } from 'app/components/blocks/card-items/items-form/select/format-nullable/getFormatSelectNullableFormItem';


interface StateProps {
  bookDataMap: IdMapOptional<BookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genres: Genre[] | undefined;
  labelsMap: IdMap<Label> | undefined;
  reviewsMap: IdMapOptional<Review> | undefined;
  personalBookDataMap: IdMapOptional<PersonalBookData> | undefined;
}

interface DispatchProps {
  updateBookData: typeof libraryAction.startUpdateBookData;
}

type Props = StateProps & DispatchProps;

const messages = PageMessages.library;
const [bookDataSubHeader, personalBookDataSubHeader, reviewSubHeader, labelsSubHeader] = [messages.subHeaders.bookData, messages.subHeaders.personalBookData, messages.subHeaders.review, messages.subHeaders.labels];
const [bookDataLabels, personalBookDataLabels, reviewLabels] = [messages.labels.bookData, messages.labels.personalBookData, messages.labels.review];

const BaseEditProfilePage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    bookDataMap,
    authorsMap,
    booksMap,
    genres,
    labelsMap,
    reviewsMap,
    personalBookDataMap,
    updateBookData,
  } = props;

  const [bookDataUpdate, setBookDataUpdate] = useState<BookDataUpdate>({});
  const [personalBookDataUpdate, setPersonalBookDataUpdate] = useState<PersonalBookDataUpdate>({});
  const [reviewUpdate, setReviewUpdate] = useState<ReviewUpdate>({});


  if (isUndefined(bookDataMap)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genres) || isUndefined(labelsMap)
    || isUndefined(reviewsMap) || isUndefined(personalBookDataMap)) {
    return <UnknownError />;
  }

  const bookData = bookDataMap[pathId];
  if (isUndefined(bookData)) {
    return <NotFoundError />;
  }

  const personalBookData = personalBookDataMap[bookData.id];
  const review = reviewsMap[bookData.id];
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);

  if (isEmptyObject(bookDataUpdate)) {
    const defaultBookDataUpdate = convertBookDataToBookDataUpdate(bookData);
    const defaultPersonalBookDataUpdate = convertPersonalBookDataToPersonalBookDataUpdate(personalBookData || null);
    const defaultReviewUpdate = convertReviewToReviewUpdate(review || null);
    setBookDataUpdate(defaultBookDataUpdate);
    setPersonalBookDataUpdate(defaultPersonalBookDataUpdate);
    setReviewUpdate(defaultReviewUpdate);
  }

  const authorItems = authors.map((author, index) => (
    getTextFormItem({
      label: index === 0 ? bookDataLabels.authorName : null,
      value: author.name,
      regexp: htmlRegExp.name,
      readOnly: true,
    })
  ));

  const cardData: EditCardData = {
    header: getCardHeader(messages.editHeader, BookSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getTextFormItem({
        label: bookDataLabels.bookName,
        value: book.name,
        readOnly: true,
      }),
      ...authorItems,
      getTextFormItem({
        label: bookDataLabels.publisher,
        value: bookDataUpdate.publisher,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'publisher'),
      }),
      getTextFormItem({
        label: bookDataLabels.yearPublished,
        value: bookDataUpdate.yearPublished,
        regexp: htmlRegExp.year,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'yearPublished'),
      }),
      getTextFormItem({
        label: bookDataLabels.isbn,
        value: bookDataUpdate.isbn,
        regexp: htmlRegExp.isbn,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'isbn'),
      }),
      getNumberSelectNullableFormItem({
        label: bookDataLabels.genre,
        value: bookDataUpdate.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'genreId'),
      }),
      getFormatSelectNullableFormItem({
        label: bookDataLabels.format,
        value: bookDataUpdate.format,
        options: Object.values(Format).map((format) => ({ name: FormatMessage[format], value: format })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'format'),
      }),

      getSubHeader(personalBookDataSubHeader),
      getDateFormItem({
        label: personalBookDataLabels.dateRead,
        value: personalBookDataUpdate.dateRead,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'dateRead'),
      }),
      getTextFormItem({
        label: personalBookDataLabels.comment,
        value: personalBookDataUpdate.comment,
        multiline: true,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'comment'),
      }),

      getSubHeader(reviewSubHeader),
      getRatingFormItem({
        label: reviewLabels.stars,
        value: reviewUpdate.stars,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'stars'),
      }),
      getTextFormItem({
        label: reviewLabels.comment,
        value: reviewUpdate.comment,
        multiline: true,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'comment'),
      }),

      getSubHeader(labelsSubHeader),
      getMultiSelectFormItem({
        label: null,
        value: bookDataUpdate.labelsIds,
        labelMap: labelsMap,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'labelsIds'),
      }),
    ],
    onSubmit: () => {
      updateBookData(pathId, { bookDataUpdate, personalBookDataUpdate, reviewUpdate });
    },
    isGoingBackOnSubmit: true,
  };

  return (
    <FormCard data={cardData} />
  );
};

export const LibraryEditPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    bookDataMap: librarySelector.getAllBookDataMap(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genres: librarySelector.getAllGenres(state),
    labelsMap: librarySelector.getAllLabelsMap(state),
    reviewsMap: librarySelector.getAllReviewsMap(state),
    personalBookDataMap: librarySelector.getAllPersonalBookDataMap(state),
  }),
  {
    updateBookData: libraryAction.startUpdateBookData,
  },
)(withLoading(
  BaseEditProfilePage,
  librarySelector.getAllBookDataStatus,
  librarySelector.getAllAuthorsStatus, librarySelector.getAllBooksStatus, librarySelector.getAllGenresStatus, librarySelector.getAllLabelsStatus,
  librarySelector.getAllReviewsStatus, librarySelector.getAllPersonalBookDataStatus,
));
