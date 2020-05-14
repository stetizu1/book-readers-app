import React, { FC } from 'react';
import { connect } from 'react-redux';
import { BookSharp } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataWithLabelIds, isBookDataWithLabelsIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ButtonType } from 'app/constants/style/ButtonType';
import { LibraryPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { userSelector } from 'app/modules/user/userSelector';
import { librarySelector } from 'app/modules/library/librarySelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { CardComponent, CardData } from 'app/components/blocks/CardComponent';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { useContainerStyle } from 'app/components/blocks/styles/ContainerStyle';

import { getCardWithItem } from 'app/components/blocks/card-items/getCardWithItem';
import { getCardWithItems } from 'app/components/blocks/card-items/getCardWithItems';
import { getLabelsContainer } from 'app/components/blocks/card-items/getLabelsContainer';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';
import { getHeader } from '../../blocks/card-components/header/getHeader';


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
      header: getHeader(booksMap[bookId].name, BookSharp),
      items: {
        left: {
          top: [
            getCardWithItems({ values: authors, structureKey: 'name', bold: true }),
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
            getRating(reviewsMap[id]?.stars),
          ],
        },
      },
      buttons: [
        getButton({
          buttonType: ButtonType.button,
          onClick: (): void => {
            props.history.push(withParameterPath(LibraryPath.detailBookData, bookData.id));
          },
        }),
        getButton({
          buttonType: ButtonType.edit,
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
