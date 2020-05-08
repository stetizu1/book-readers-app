import React, { FC } from 'react';
import { connect } from 'react-redux';
import { BookSharp } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ButtonMessage } from 'app/messages/ButtonMessage';
import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { userSelector } from 'app/modules/user/userSelector';

import { withLoading } from 'app/components/helpers/withLoading';
import { CardComponent, CardData } from 'app/components/common/CardComponent';
import { getButton } from 'app/components/common/blockCreators/getButton';

import { useButtonStyle } from 'app/components/common/styles/buttons/ButtonsStyle';
import { useContainerStyle } from 'app/components/common/styles/ContainerStyle';
import { librarySelector } from 'app/modules/library/librarySelector';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { PageMessages } from 'app/messages/PageMessages';

import { getImage } from 'app/components/common/blockCreators/getImage';
import { getCardItems } from 'app/components/pages/library/getCardItems';
import { LibraryPath } from 'app/constants/Path';
import { withParameter } from 'app/helpers/path/parameters';


interface StateProps {
  allBookData: BookDataWithLabelIds[] | undefined;
  authorsMap: IdMap<Author> | undefined;
  booksMap: IdMap<BookWithAuthorIds> | undefined;
  genresMap: IdMap<Genre> | undefined;
  labelsMap: IdMap<Label> | undefined;
  reviewsMap: IdMapOptional<Review> | undefined;
  personalBookDataMap: IdMapOptional<PersonalBookData> | undefined;
}

type Props = StateProps & RouteComponentProps;


const BaseLibraryPage: FC<Props> = (props) => {
  const buttonClasses = useButtonStyle();
  const classes = useContainerStyle();
  const {
    allBookData, authorsMap, booksMap, genresMap, labelsMap, personalBookDataMap, reviewsMap,
  } = props;

  if (isUndefined(allBookData)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(labelsMap)
    || isUndefined(reviewsMap) || isUndefined(personalBookDataMap)) {
    return null;
  }

  const getCardData = (data: BookDataWithLabelIds): CardData => {
    const cardItems = getCardItems(data, booksMap, authorsMap, genresMap, labelsMap, reviewsMap, personalBookDataMap);
    return {
      image: getImage(BookSharp, false),
      ...cardItems,
      buttons: [
        getButton({
          variant: ButtonVariant.contained,
          classType: buttonClasses.edit,
          label: ButtonMessage.Edit,
          onClick: (): void => {
            props.history.push(withParameter(LibraryPath.editBookData, data.id));
          },
        }),
      ],
    };
  };

  return (
    <>
      <div className={classes.container}>
        <h1>{PageMessages.library.header}</h1>
      </div>
      <div className={classes.container}>
        {allBookData.map((bookData) => (
          <CardComponent data={getCardData(bookData)} key={bookData.id} />
        ))}
      </div>
    </>
  );
};

export const LibraryPage = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    allBookData: librarySelector.getAllBookData(state),
    authorsMap: librarySelector.getAllAuthorsMap(state),
    booksMap: librarySelector.getAllBooksMap(state),
    genresMap: librarySelector.getAllGenresMap(state),
    labelsMap: librarySelector.getAllLabelsMap(state),
    reviewsMap: librarySelector.getAllReviewsMap(state),
    personalBookDataMap: librarySelector.getAllPersonalBookDataMap(state),
  }),
)(withRouter(withLoading(BaseLibraryPage, userSelector.getCurrentUserStatus)));
