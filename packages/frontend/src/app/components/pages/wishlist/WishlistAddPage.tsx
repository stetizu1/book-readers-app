import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StarsSharp } from '@material-ui/icons';

import { Format } from 'book-app-shared/types/enums/Format';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataCreateFromBookRequest } from 'book-app-shared/types/BookData';
import { yearRegExp } from 'book-app-shared/constants/regexp';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { FormatMessage } from 'app/messages/FormatMessage';

import { AppState } from 'app/types/AppState';

import { getUpdateValue } from 'app/helpers/updateValue';
import { getNamedCreateDefault } from 'app/helpers/form/create-default/named';

import { userSelector } from 'app/modules/user/userSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getNumberSelectWithUndefinedFormItem } from 'app/components/blocks/card-items/items-form/select/number-with-undefined/getNumberSelectWithUndefinedFormItem';
import { getFormatSelectWithUndefinedFormItem } from 'app/components/blocks/card-items/items-form/select/format-with-undefined/getFormatSelectWithUndefinedFormItem';


interface StateProps {
  genres: Genre[] | undefined;
  currentUserId: number | undefined;
}

interface DispatchProps {
  startCreateBookRequest: typeof wishlistAction.startCreateBookRequest;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const messages = PageMessages.wishlist;
const libraryMessages = PageMessages.library;
const [bookDataSubHeader, bookDataLabels] = [libraryMessages.subHeaders.bookData, libraryMessages.labels.bookData];

const BaseWishlistAddPage: FC<Props> = (props) => {
  const [bookCreateSimple, setBookCreate] = useState<{ name: string }>(getNamedCreateDefault);
  const [author, setAuthor] = useState<{ name: string }>(getNamedCreateDefault);
  const [bookDataCreateFromBookRequest, setBookDataCreate] = useState<Partial<BookDataCreateFromBookRequest>>({});
  const [comment, setComment] = useState<string>('');

  const {
    genres, startCreateBookRequest, history,
    currentUserId,
  } = props;

  if (isUndefined(genres) || isUndefined(currentUserId)) {
    return <UnknownError />;
  }

  const cardData: EditCardData = {
    header: getCardHeader(messages.addHeader, StarsSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getTextFormItem({
        label: bookDataLabels.bookName,
        required: true,
        value: bookCreateSimple.name,
        updateValueFunction: getUpdateValue(bookCreateSimple, setBookCreate, 'name'),
      }),
      getTextFormItem({
        label: bookDataLabels.authorName,
        required: true,
        value: author.name,
        updateValueFunction: getUpdateValue(author, setAuthor, 'name'),
      }),
      // todo more authors
      getTextFormItem({
        label: bookDataLabels.publisher,
        value: bookDataCreateFromBookRequest.publisher,
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'publisher'),
      }),
      getTextFormItem({
        label: bookDataLabels.yearPublished,
        value: bookDataCreateFromBookRequest.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'yearPublished'),
      }),
      getTextFormItem({
        label: bookDataLabels.isbn,
        value: bookDataCreateFromBookRequest.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'isbn'),
      }),
      getNumberSelectWithUndefinedFormItem({
        label: bookDataLabels.genre,
        value: bookDataCreateFromBookRequest.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'genreId'),
      }),
      getFormatSelectWithUndefinedFormItem({
        label: bookDataLabels.format,
        value: bookDataCreateFromBookRequest.format,
        options: Object.values(Format).map((format) => ({ name: FormatMessage[format], value: format })),
        updateValueFunction: getUpdateValue(bookDataCreateFromBookRequest, setBookDataCreate, 'format'),
      }),
      getSubHeader(messages.labels.next),
      getTextFormItem({
        label: messages.labels.comment,
        value: comment,
        updateValueFunction: (value) => setComment(value),
      }),
    ],
    onSubmit: () => {
      const bookCreate = {
        ...bookCreateSimple,
        authors: [
          author,
        ],
      };
      const bookRequestCreate = {
        comment,
        userId: currentUserId,
        createdByBookingUser: false,
        bookData: bookDataCreateFromBookRequest,
      };

      startCreateBookRequest({ bookCreate, bookRequestCreate });
      history.push(MenuPath.wishlist);
    },
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
)(withRouter(withLoading(
  BaseWishlistAddPage,
  librarySelector.getAllGenresStatus,
  userSelector.getCurrentUserStatus,
)));
