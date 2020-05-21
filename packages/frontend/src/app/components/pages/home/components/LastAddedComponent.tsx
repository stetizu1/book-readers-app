import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookData } from 'book-app-shared/types/BookData';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';


import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { librarySelector } from '../../../../modules/library/librarySelector';
import { DoubleCard } from '../../../blocks/card-components/double-card/DoubleCard';
import { IdMap } from '../../../../types/IdMap';
import { getButton } from '../../../blocks/card-items/button/getButton';
import { ButtonType } from '../../../../constants/style/types/ButtonType';
import { MenuPath } from '../../../../constants/Path';
import { getItem } from '../../../blocks/card-items/items-list/item/getItem';
import { getSubHeader } from '../../../blocks/card-items/items-shared/subheader/getSubHeader';
import { getItems } from '../../../blocks/card-items/items-list/items/getItems';
import { FormatMessage } from '../../../../messages/FormatMessage';
import { ButtonMessage } from '../../../../messages/ButtonMessage';


interface StateProps {
  bookData: BookData[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
}

type Props = StateProps & RouteComponentProps;

const messages = PageMessages.home.lastAdded;

export const BaseLastAddedComponent: FC<Props> = (props) => {
  const {
    bookData, authorsMap, booksMap, history,
  } = props;
  if (isUndefined(bookData) || isUndefined(booksMap) || isUndefined(authorsMap)) {
    return <UnknownError />;
  }

  const isLeft = bookData.length > 0;
  const isRight = bookData.length > 1;

  const getElements = (data: BookData): JSX.Element[] => {
    const authors = booksMap[data.bookId].authorIds.map((authorId) => authorsMap[authorId]);
    return [
      getSubHeader(booksMap[data.bookId].name),
      getItems({ values: authors, structureKey: 'name' }),
      getItem({ value: !isNull(data.format) ? FormatMessage[data.format] : null }),
    ];
  };


  const leftItems = isLeft ? getElements(bookData[0]) : undefined;
  const rightItems = isRight ? getElements(bookData[1]) : undefined;

  return (
    <DoubleCard data={{
      header: getCardHeader(messages.header),
      itemsLeft: leftItems,
      itemsRight: rightItems,
      emptyMessage: messages.emptyMessage,
      button: getButton({
        buttonType: ButtonType.button,
        label: ButtonMessage.ToLibrary,
        onClick: (): void => {
          history.push(MenuPath.library);
        },
      }),
    }}
    />
  );
};

export const LastAddedComponent = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    bookData: librarySelector.getAllBookDataSorted(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
  }),
)(withRouter(withLoading(
  BaseLastAddedComponent,
  librarySelector.getAllBookDataStatus,
  librarySelector.getAllAuthorsStatus,
  librarySelector.getAllBooksStatus,
)));
