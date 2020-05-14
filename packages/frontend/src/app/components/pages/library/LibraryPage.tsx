import React, { FC } from 'react';
import { connect } from 'react-redux';
import { BookSharp } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataWithLabelIds, isBookDataWithLabelsIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ButtonMessage } from 'app/messages/ButtonMessage';
import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { userSelector } from 'app/modules/user/userSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { CardComponent, CardData } from 'app/components/common/CardComponent';
import { getButton } from 'app/components/common/blockCreators/getButton';

import { useButtonStyle } from 'app/components/common/styles/buttons/ButtonsStyle';
import { useContainerStyle } from 'app/components/common/styles/ContainerStyle';
import { librarySelector } from 'app/modules/library/librarySelector';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { PageMessages } from 'app/messages/PageMessages';

import { getImage } from 'app/components/common/blockCreators/getImage';
import { LibraryPath } from 'app/constants/Path';
import { withParameterPath } from 'app/helpers/path/parameters';
import { getCardWithItem } from 'app/components/common/blockCreators/getCardWithItem';
import { getCardWithItems } from 'app/components/common/blockCreators/getCardWithItems';
import { getLabelsContainer } from 'app/components/common/blockCreators/getLabelsContainer';
import { getStars } from 'app/components/common/blockCreators/getStars';


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

  const getCardData = (bookData: BookDataWithLabelIds): CardData => {
    const {
      id, format, publisher, bookId, genreId,
    } = bookData;

    const authors = booksMap[bookId].authorIds.map((authorId) => authorsMap[authorId]);

    const labels = isBookDataWithLabelsIds(bookData) ? bookData.labelsIds.map((labelId) => labelsMap[labelId]) : [];
    const genre = !isNull(genreId) ? genresMap[genreId] : null;

    return {
      image: getImage(BookSharp, false),
      items: {
        left: {
          top: [
            getCardWithItem({ value: booksMap[bookId].name, bold: true }),
            getCardWithItems({ values: authors, structureKey: 'name' }),
            getCardWithItem({ value: publisher }),
          ],
          bottom: [
            getLabelsContainer(labels),
            getCardWithItem({ value: personalBookDataMap[id]?.comment }),
          ],
        },
        right: {
          top: [
            getCardWithItem({ value: format }),
            getCardWithItem({ value: genre?.name }),
          ],
          bottom: [
            getCardWithItem({ prefix: PageMessages.library.item.dateRead, value: personalBookDataMap[id]?.dateRead }),
            getStars(reviewsMap[id]?.stars),
          ],
        },
      },
      buttons: [
        getButton({
          variant: ButtonVariant.contained,
          classType: buttonClasses.detail,
          label: ButtonMessage.Detail,
          onClick: (): void => {
            props.history.push(withParameterPath(LibraryPath.detailBookData, bookData.id));
          },
        }),
        getButton({
          variant: ButtonVariant.contained,
          classType: buttonClasses.edit,
          label: ButtonMessage.Edit,
          onClick: (): void => {
            props.history.push(withParameterPath(LibraryPath.editBookData, bookData.id));
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
