import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { MenuPath, WishlistPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';

import { IdMap } from 'app/types/IdMap';

import { AppState } from 'app/types/AppState';

import { withParameterPath } from 'app/helpers/path/parameters';

import { librarySelector } from 'app/modules/library/librarySelector';
import { userSelector } from 'app/modules/user/userSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';
import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';
import { wishlistAction } from 'app/modules/wishlist/wishlistAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { ConfirmationDialog } from 'app/components/blocks/card-components/confirmation-dialog/ConfirmationDialog';
import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  bookRequests: IdMap<BookRequestWithBookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
}

interface DispatchProps {
  deleteBookRequest: typeof wishlistAction.startDeleteBookRequest;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;


const BaseWishlistDetailPage: FC<Props> = (props) => {
  const { id: pathId } = useParams();

  const {
    bookRequests,
    authorsMap, booksMap, genresMap,
    deleteBookRequest, setDialogState,
    history,
  } = props;
  if (isUndefined(bookRequests) || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap)) {
    return null;
  }

  const bookRequest = bookRequests[pathId];
  const bookData = bookRequest.bookData;
  const book = booksMap[bookData.bookId];
  const authors = book.authorIds.map((authorId) => authorsMap[authorId]);
  const genre = bookData.genreId ? genresMap[bookData.genreId] : undefined;

  const bookDataSubHeaders = PageMessages.bookDetail.subHeaders.bookData;

  const cardData: CardData = {
    header: getCardHeader(PageMessages.wishlist.detailHeader, BookSharp),
    items: [
      getSubHeader(bookDataSubHeaders.header),
      getItem({ label: bookDataSubHeaders.bookName, value: book.name }),
      getItems({ label: bookDataSubHeaders.authorName, values: authors, structureKey: 'name' }),
      getItem({ label: bookDataSubHeaders.format, value: bookData.format }),
      getItem({ label: bookDataSubHeaders.publisher, value: bookData.publisher }),
      getItem({ label: bookDataSubHeaders.yearPublished, value: bookData.yearPublished }),
      getItem({ label: bookDataSubHeaders.isbn, value: bookData.isbn }),
      getItem({ label: bookDataSubHeaders.genre, value: genre?.name }),

      getSubHeader(PageMessages.wishlist.subHeaders.next),
      getItem({ label: PageMessages.wishlist.subHeaders.comment, value: bookRequest.comment }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        onClick: (): void => {
          props.setDialogState(true);
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          props.history.push(withParameterPath(WishlistPath.wishlistEdit, bookData.id));
        },
      }),
    ],
  };

  const confirmationData = {
    header: getCardHeader(PageMessages.wishlist.delete.header),
    description: getDescription(PageMessages.wishlist.delete.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        deleteBookRequest(bookData.id);
        setDialogState(false);
        history.push(MenuPath.wishlist);
      },
    }),
  };

  return (
    <>
      <Card data={cardData} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const WishlistDetailPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    bookRequests: wishlistSelector.getWishlistMap(state),
  }),
  {
    deleteBookRequest: wishlistAction.startDeleteBookRequest,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(BaseWishlistDetailPage, userSelector.getCurrentUserStatus)));
