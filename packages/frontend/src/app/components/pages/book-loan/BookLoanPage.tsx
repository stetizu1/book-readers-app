import React, { FC } from 'react';
import { connect } from 'react-redux';
import { PersonPinSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookData } from 'book-app-shared/types/BookData';
import { Borrowed } from 'book-app-shared/types/Borrowed';
import { User } from 'book-app-shared/types/User';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { BookLoanPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { userSelector } from 'app/modules/user/userSelector';
import { librarySelector } from 'app/modules/library/librarySelector';
import { bookLoanSelector } from 'app/modules/book-loan/bookLoanSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { GridCards } from 'app/components/blocks/card-components/grid-cards/Cards';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';


interface StateProps {
  bookDataMap: IdMap<BookData> | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  usersMap: IdMap<User> | undefined;
  bookLoans: Borrowed[] | undefined;
}

type Props = StateProps & RouteComponentProps;


const BaseBookLoanPage: FC<Props> = (props) => {
  const {
    bookLoans,
    authorsMap, booksMap, bookDataMap, usersMap,
    history,
  } = props;

  if (isUndefined(bookDataMap)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(bookLoans) || isUndefined(usersMap)
  ) {
    return null;
  }

  const getNameOrEmail = (borrowed: Borrowed): string | null => {
    if (isNull(borrowed.userBorrowedId)) return null;
    const { name, email } = usersMap[borrowed.userBorrowedId];
    return isNull(name) ? email : name;
  };

  const getGridCardData = (borrowed: Borrowed): GridCardData => {
    const bookData = bookDataMap[borrowed.bookDataId];
    const {
      publisher, bookId,
    } = bookData;

    const authors = booksMap[bookId].authorIds.map((authorId) => authorsMap[authorId]);

    return {
      header: getCardHeader(booksMap[bookId].name, PersonPinSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: publisher }),
      ],
      bottomLeftItems: [
        getItem({ value: borrowed.comment }),
      ],

      topRightItems: [
        getItem({ value: getNameOrEmail(borrowed) }),
        getItem({ value: borrowed.nonUserName }),
      ],
      bottomRightItems: [
        getItem({ value: borrowed.until }),
      ],
      buttons: [
        getButton({
          buttonType: ButtonType.button,
          onClick: (): void => {
            history.push(withParameterPath(BookLoanPath.detail, borrowed.id));
          },
        }),
        getButton({
          buttonType: ButtonType.edit,
          onClick: (): void => {
            history.push(withParameterPath(BookLoanPath.edit, borrowed.id));
          },
        }),
      ],
    };
  };
  const buttons = [
    getButton({
      buttonType: ButtonType.button,
      label: ButtonMessage.Borrowed,
      onClick: (): void => {
        history.push(BookLoanPath.borrowed);
      },
    }),
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddLoan,
      onClick: (): void => {
        history.push(BookLoanPath.add);
      },
    }),
  ];

  const getKey = (borrowed: Borrowed): string => String(borrowed.id);
  return (
    <>
      {getPageHeader(PageMessages.bookLoan.header)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}
      <GridCards data={bookLoans} getGridCardData={getGridCardData} getKey={getKey} />
    </>
  );
};

export const BookLoanPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    bookDataMap: librarySelector.getAllBookDataMap(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    usersMap: userSelector.getUsersMap(state),
    bookLoans: bookLoanSelector.getAllActiveBookLoans(state),
  }),
)(withRouter(withLoading(BaseBookLoanPage, userSelector.getCurrentUserStatus)));
