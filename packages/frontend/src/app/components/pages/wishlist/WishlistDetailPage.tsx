import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { WishlistPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';
import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { Card, CardData } from 'app/components/blocks/card-components/card/Card';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';


interface StateProps {
  bookRequests: IdMapOptional<BookRequestWithBookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.wishlist;
const libraryMessages = PageMessages.library;
const [bookDataSubHeader, bookDataLabels] = [libraryMessages.subHeaders.bookData, libraryMessages.labels.bookData];

const BaseWishlistDetailPage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    bookRequests,
    authorsMap, booksMap, genresMap,
    history,
  } = props;
  if (isUndefined(bookRequests) || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap)) {
    return <UnknownError />;
  }
  const bookRequest = bookRequests[pathId];
  if (isUndefined(bookRequest)) {
    return <NotFoundError />;
  }

  const bookData = bookRequest.bookData;
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
  const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;

  const cardData: CardData = {
    header: getCardHeader(messages.detailHeader, BookSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getItem({ label: bookDataLabels.bookName, value: book.name }),
      getItems({ label: bookDataLabels.authorName, values: authors, structureKey: 'name' }),
      getItem({ label: bookDataLabels.format, value: bookData.format }),
      getItem({ label: bookDataLabels.publisher, value: bookData.publisher }),
      getItem({ label: bookDataLabels.yearPublished, value: bookData.yearPublished }),
      getItem({ label: bookDataLabels.isbn, value: bookData.isbn }),
      getItem({ label: bookDataLabels.genre, value: genre?.name }),

      getSubHeader(messages.labels.next),
      getItem({ label: messages.labels.comment, value: bookRequest.comment }),
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
          history.push(withParameterPath(WishlistPath.wishlistEdit, bookData.id));
        },
      }),
    ],
  };

  return (
    <Card data={cardData} />
  );
};

export const WishlistDetailPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    bookRequests: wishlistSelector.getWishlistMap(state),
  }),
)(withRouter(withLoading(
  BaseWishlistDetailPage,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
  librarySelector.getAllGenresStatus,
  wishlistSelector.getWishlistStatus,
)));
