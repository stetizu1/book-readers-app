import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AccountBoxSharp } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { BookData, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ButtonMessage } from 'app/messages/ButtonMessage';
import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { userSelector } from 'app/modules/user/userSelector';

import { withLoading } from 'app/components/helpers/withLoading';
import { CardComponent, CardData } from 'app/components/common/CardComponent';
import { getButton } from 'app/components/common/blockCreators/getButton';

import { useButtonStyle } from 'app/components/common/styles/buttons/ButtonsStyle';
import { useContainerStyle } from 'app/components/common/styles/ContainerStyle';
import { librarySelector } from 'app/modules/library/librarySelector';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { PageMessages } from 'app/messages/PageMessages';


interface StateProps {
  bookData: BookDataWithLabelIds[] | undefined;
  authors: IdMap<Author> | undefined;
  books: IdMap<BookWithAuthorIds> | undefined;
  genres: IdMap<Genre> | undefined;
  labels: IdMap<Label> | undefined;
  reviews: IdMap<Review> | undefined;
  personalBookData: IdMap<PersonalBookData> | undefined;
}

type Props = StateProps & RouteComponentProps;

const BaseLibraryPage: FC<Props> = (props) => {
  const buttonClasses = useButtonStyle();
  const classes = useContainerStyle();
  const {
    bookData, authors, books, genres, labels,
  } = props;

  if (isUndefined(bookData) || isUndefined(authors) || isUndefined(books) || isUndefined(genres) || isUndefined(labels)) {
    return null;
  }

  const getCardData = (data: BookData): CardData<BookData> => {
    const book = books[data.bookId];
    return ({
      subHeader: `${book.name}, ${authors[book.authorIds[0]].name}`,
      image: AccountBoxSharp,
      items: [],
      buttons: [
        getButton({
          variant: ButtonVariant.contained,
          classType: buttonClasses.edit,
          label: ButtonMessage.Edit,
          onClick: (): void => {
            props.history.push('edit');
          },
        }),
      ],
    });
  };

  return (
    <>
      <div className={classes.container}>
        <h1>{PageMessages.library.header}</h1>
      </div>
      <div className={classes.container}>
        <CardComponent data={getCardData(bookData[0])} />
      </div>
    </>
  );
};

export const LibraryPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    bookData: librarySelector.getAllBookData(state),
    authors: librarySelector.getAllAuthorsMap(state),
    books: librarySelector.getAllBooksMap(state),
    genres: librarySelector.getAllGenresMap(state),
    labels: librarySelector.getAllLabelsMap(state),
    reviews: librarySelector.getAllReviewsMap(state),
    personalBookData: librarySelector.getAllPersonalBookDataMap(state),
  }),
)(withRouter(withLoading(BaseLibraryPage, userSelector.getCurrentUserStatus)));
