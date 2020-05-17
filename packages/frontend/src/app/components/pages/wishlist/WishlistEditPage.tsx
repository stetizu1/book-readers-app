import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { StarsSharp } from '@material-ui/icons';

import { Format } from 'book-app-shared/types/enums/Format';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataUpdate } from 'book-app-shared/types/BookData';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { yearRegExp } from 'book-app-shared/constants/regexp';
import { convertBookDataToBookDataUpdate } from 'book-app-shared/helpers/convert-to-update/bookData';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';

import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';
import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';

import { withLoading } from 'app/components/wrappers/withLoading';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getSelectFormItem } from 'app/components/blocks/card-items/items-form/select/getSelectFormItem';


interface StateProps {
  bookRequestsMap: IdMap<BookRequestWithBookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
}

interface DispatchProps {
  startUpdateBookRequest: typeof wishlistAction.startUpdateBookRequest;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const BaseWishlistEditPage: FC<Props> = (props) => {
  const {
    bookRequestsMap,
    genresMap, booksMap, authorsMap,
    startUpdateBookRequest,
    history,
  } = props;
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const defaultBookDataUpdate = !isUndefined(bookRequestsMap) ? convertBookDataToBookDataUpdate(bookRequestsMap[pathId].bookData) : {};
  const defaultComment = bookRequestsMap?.[pathId].comment || '';
  const [bookDataUpdate, setBookDataUpdate] = useState<BookDataUpdate>(defaultBookDataUpdate);
  const [comment, setComment] = useState<string>(defaultComment);

  if (isUndefined(genresMap) || isUndefined(bookRequestsMap) || isUndefined(booksMap) || isUndefined(authorsMap)) {
    return null;
  }
  const bookRequest = bookRequestsMap[pathId];
  const { bookData } = bookRequest;
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
  const genres = Object.values(genresMap);

  const bookDataSubHeaders = PageMessages.bookDetail.subHeaders.bookData;

  const authorItems = authors.map((author, index) => (
    getTextFormItem({
      label: index === 0 ? bookDataSubHeaders.authorName : null,
      value: author.name,
      readOnly: true,
    })
  ));

  const cardData: EditCardData = {
    header: getCardHeader(PageMessages.wishlist.createHeader, StarsSharp),
    items: [
      getSubHeader(bookDataSubHeaders.header),
      getTextFormItem({
        label: bookDataSubHeaders.bookName,
        value: book.name,
        readOnly: true,
      }),
      ...authorItems,
      getTextFormItem({
        label: bookDataSubHeaders.publisher,
        value: bookDataUpdate.publisher,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'publisher'),
      }),
      getTextFormItem({
        label: bookDataSubHeaders.yearPublished,
        value: bookDataUpdate.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'yearPublished'),
      }),
      getTextFormItem({
        label: bookDataSubHeaders.isbn,
        value: bookDataUpdate.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'isbn'),
      }),
      getSelectFormItem<number>({
        label: bookDataSubHeaders.genre,
        value: bookDataUpdate.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'genreId'),
        convert: Number,
      }),
      getSelectFormItem<Format>({
        label: bookDataSubHeaders.format,
        value: bookDataUpdate.format,
        options: Object.values(Format).map((format) => ({ name: format, value: format })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'format'),
        convert: (value) => (String(value) as Format),
      }),
      getSubHeader(PageMessages.wishlist.subHeaders.next),
      getTextFormItem({
        label: PageMessages.wishlist.subHeaders.comment,
        value: comment,
        updateValueFunction: (value) => setComment(value),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        onClick: (): void => {
          const bookRequestUpdate = {
            comment,
          };
          startUpdateBookRequest(pathId, { bookRequestUpdate, bookDataUpdate });
          history.push(MenuPath.wishlist);
        },
      }),
    ],
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
)(withRouter(withLoading(BaseWishlistEditPage, wishlistSelector.getWishlistStatus)));
