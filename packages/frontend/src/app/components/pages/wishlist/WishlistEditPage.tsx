import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { StarsSharp } from '@material-ui/icons';

import { Format } from 'book-app-shared/types/enums/Format';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataUpdate } from 'book-app-shared/types/BookData';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { htmlRegExp } from 'book-app-shared/constants/regexp';
import { convertBookDataToBookDataUpdate } from 'book-app-shared/helpers/convert-to-update/bookData';
import { isEmptyObject } from 'book-app-shared/helpers/validators';

import { PageMessages } from 'app/messages/PageMessages';
import { FormatMessage } from 'app/messages/FormatMessage';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';

import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';
import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getNumberSelectNullableFormItem } from 'app/components/blocks/card-items/items-form/select/number-nullable/getNumberSelectNullableFormItem';
import { getFormatSelectNullableFormItem } from 'app/components/blocks/card-items/items-form/select/format-nullable/getFormatSelectNullableFormItem';


interface StateProps {
  bookRequestsMap: IdMapOptional<BookRequestWithBookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
}

interface DispatchProps {
  startUpdateBookRequest: typeof wishlistAction.startUpdateBookRequest;
}

type Props = StateProps & DispatchProps;

const messages = PageMessages.wishlist;
const libraryMessages = PageMessages.library;
const [bookDataSubHeader, bookDataLabels] = [libraryMessages.subHeaders.bookData, libraryMessages.labels.bookData];

const BaseWishlistEditPage: FC<Props> = (props) => {
  const {
    bookRequestsMap,
    genresMap, booksMap, authorsMap,
    startUpdateBookRequest,
  } = props;
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const [bookDataUpdate, setBookDataUpdate] = useState<BookDataUpdate>({});
  const [comment, setComment] = useState<string>('');

  if (isUndefined(genresMap) || isUndefined(bookRequestsMap) || isUndefined(booksMap) || isUndefined(authorsMap)) {
    return <UnknownError />;
  }

  const bookRequest = bookRequestsMap[pathId];
  if (isUndefined(bookRequest)) {
    return <NotFoundError />;
  }

  if (isEmptyObject(bookDataUpdate)) {
    const defaultState = convertBookDataToBookDataUpdate(bookRequest.bookData);
    setBookDataUpdate(defaultState);
    setComment(bookRequest.comment || '');
  }

  const { bookData } = bookRequest;
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
  const genres = Object.values(genresMap);

  const authorItems = authors.map((author, index) => (
    getTextFormItem({
      label: index === 0 ? bookDataLabels.authorName : null,
      value: author.name,
      readOnly: true,
    })
  ));

  const cardData: EditCardData = {
    header: getCardHeader(messages.editHeader, StarsSharp),
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
      getSubHeader(messages.labels.next),
      getTextFormItem({
        label: messages.labels.comment,
        multiline: true,
        value: comment,
        updateValueFunction: (value) => setComment(value),
      }),
    ],
    onSubmit: (): void => {
      const bookRequestUpdate = {
        comment,
      };
      startUpdateBookRequest(pathId, { bookRequestUpdate, bookDataUpdate });
    },
    isGoingBackOnSubmit: true,
  };

  return (
    <FormCard data={cardData} />
  );
};

export const WishlistEditPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    bookRequestsMap: wishlistSelector.getWishlistMap(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
  }),
  {
    startUpdateBookRequest: wishlistAction.startUpdateBookRequest,
  },
)(withLoading(
  BaseWishlistEditPage,
  wishlistSelector.getWishlistStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  librarySelector.getAllGenresStatus,
));
