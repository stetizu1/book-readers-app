import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StarsSharp } from '@material-ui/icons';

import { Format } from 'book-app-shared/types/enums/Format';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataCreateFromBookRequest } from 'book-app-shared/types/BookData';
import { yearRegExp } from 'book-app-shared/constants/regexp';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { getUpdateValue } from 'app/helpers/updateValue';
import { getNamedCreateDefault } from 'app/helpers/form/create-default/named';

import { userSelector } from 'app/modules/user/userSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';

import { withLoading } from 'app/components/wrappers/withLoading';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getSelectFormItem } from 'app/components/blocks/card-items/items-form/select/getSelectFormItem';


interface StateProps {
  genres: Genre[] | undefined;
  currentUserId: number | undefined;
}

interface DispatchProps {
  startCreateBookRequest: typeof wishlistAction.startCreateBookRequest;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const BaseWishlistAddPage: FC<Props> = (props) => {
  const [bookCreateSimple, setBookCreate] = useState<{ name: string }>(getNamedCreateDefault);
  const [author, setAuthor] = useState<{ name: string }>(getNamedCreateDefault);
  const [bookDataCreateFromBookRequest, setBookDataCreate] = useState<Partial<BookDataCreateFromBookRequest>>({});
  const [comment, setComment] = useState<string>('');

  const {
    genres, startCreateBookRequest, history,
    currentUserId,
  } = props;

  if (isUndefined(genres) || isUndefined(isUndefined(genres))) {
    return null;
  }
  const bookDataSubHeaders = PageMessages.bookDetail.subHeaders.bookData;

  const cardData: EditCardData = {
    header: getCardHeader(PageMessages.wishlist.createHeader, StarsSharp),
    items: [
      getSubHeader(bookDataSubHeaders.header),
      getTextFormItem({
        label: bookDataSubHeaders.bookName,
        required: true,
        value: bookCreateSimple.name,
        updateValueFunction: getUpdateValue(bookCreateSimple, setBookCreate, 'name'),
      }),
      getTextFormItem({
        label: bookDataSubHeaders.authorName,
        required: true,
        value: author.name,
        updateValueFunction: getUpdateValue(author, setAuthor, 'name'),
      }),
      // todo more authors
      getTextFormItem({
        label: bookDataSubHeaders.publisher,
        value: bookDataCreateFromBookRequest.publisher,
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'publisher'),
      }),
      getTextFormItem({
        label: bookDataSubHeaders.yearPublished,
        value: bookDataCreateFromBookRequest.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'yearPublished'),
      }),
      getTextFormItem({
        label: bookDataSubHeaders.isbn,
        value: bookDataCreateFromBookRequest.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'isbn'),
      }),
      getSelectFormItem<number>({
        label: bookDataSubHeaders.genre,
        value: bookDataCreateFromBookRequest.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'genreId'),
        convert: Number,
      }),
      getSelectFormItem<Format>({
        label: bookDataSubHeaders.format,
        value: bookDataCreateFromBookRequest.format,
        options: Object.values(Format).map((format) => ({ name: format, value: format })),
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'format'),
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
          const userId = currentUserId;
          if (isUndefined(userId)) return;

          const bookCreate = {
            ...bookCreateSimple,
            authors: [
              author,
            ],
          };
          const bookRequestCreate = {
            comment,
            userId,
            createdByBookingUser: false,
            bookData: bookDataCreateFromBookRequest,
          };

          startCreateBookRequest({ bookCreate, bookRequestCreate });
          history.push(MenuPath.wishlist);
        },
      }),
    ],
  };

  return (
    <FormCard data={cardData} />
  );
};

export const WishlistAddPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    genres: librarySelector.getAllGenres(state),
    currentUserId: userSelector.getCurrentUserId(state),
  }),
  {
    startCreateBookRequest: wishlistAction.startCreateBookRequest,
  },
)(withRouter(withLoading(BaseWishlistAddPage, userSelector.getCurrentUserStatus)));
