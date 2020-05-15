import React, { FC } from 'react';
import { connect } from 'react-redux';
import { BookSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Author } from 'book-app-shared/types/Author';
import { BookWithAuthorIds } from 'book-app-shared/types/Book';
import { Genre } from 'book-app-shared/types/Genre';
import { BookDataWithLabelIds, isBookDataWithLabelsIds } from 'book-app-shared/types/BookData';
import { Label } from 'book-app-shared/types/Label';
import { Review } from 'book-app-shared/types/Review';
import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { LibraryPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMap, IdMapOptional } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { userSelector } from 'app/modules/user/userSelector';
import { librarySelector } from 'app/modules/library/librarySelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getItems } from 'app/components/blocks/card-items/items-list/items/getItems';
import { getLabelsContainer } from 'app/components/blocks/card-items/items-list/labels-container/getLabelsContainer';
import { getRating } from 'app/components/blocks/card-items/items-list/rating/getRating';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getInlineItem } from '../../blocks/card-items/items-list/inline-item/getInlineItem';
import { GridCard, GridCardData } from '../../blocks/card-components/grid-card/GridCard';
import { getPageHeader } from '../../blocks/page-header/getPageHeader';
import { getButtonsLayout } from '../../blocks/card-layout/buttons/getButtonsLayout';
import { ButtonMessage } from '../../../messages/ButtonMessage';
import { ButtonLayoutType } from '../../../constants/style/types/ButtonLayoutType';


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
  const {
    allBookData, authorsMap, booksMap, genresMap, labelsMap, personalBookDataMap, reviewsMap,
  } = props;

  if (isUndefined(allBookData)
    || isUndefined(authorsMap) || isUndefined(booksMap) || isUndefined(genresMap) || isUndefined(labelsMap)
    || isUndefined(reviewsMap) || isUndefined(personalBookDataMap)) {
    return null;
  }

  const getGridCardData = (bookData: BookDataWithLabelIds): GridCardData => {
    const {
      id, format, publisher, bookId, genreId,
    } = bookData;

    const authors = booksMap[bookId].authorIds.map((authorId) => authorsMap[authorId]);

    const labels = isBookDataWithLabelsIds(bookData) ? bookData.labelsIds.map((labelId) => labelsMap[labelId]) : [];
    const genre = !isNull(genreId) ? genresMap[genreId] : null;

    return {
      header: getCardHeader(booksMap[bookId].name, BookSharp),
      topLeftItems: [
        getItems({ values: authors, structureKey: 'name' }),
        getItem({ value: publisher }),
      ],
      bottomLeftItems: [
        getItem({ value: personalBookDataMap[id]?.comment }),
        getLabelsContainer(labels),
      ],

      topRightItems: [
        getItem({ value: format }),
        getItem({ value: genre?.name }),
      ],
      bottomRightItems: [
        getInlineItem({ label: PageMessages.library.item.dateRead, value: personalBookDataMap[id]?.dateRead }),
        getRating(reviewsMap[id]?.stars),
      ],
      buttons: [
        getButton({
          buttonType: ButtonType.button,
          onClick: (): void => {
            props.history.push(withParameterPath(LibraryPath.detail, bookData.id));
          },
        }),
        getButton({
          buttonType: ButtonType.edit,
          onClick: (): void => {
            props.history.push(withParameterPath(LibraryPath.edit, bookData.id));
          },
        }),
      ],
    };
  };
  const addButton = getButton({
    buttonType: ButtonType.save,
    label: ButtonMessage.AddBook,
    onClick: (): void => {
      props.history.push(LibraryPath.add);
    },
  });

  return (
    <>
      {getPageHeader(PageMessages.library.header)}
      {getButtonsLayout([addButton], ButtonLayoutType.outsideAdjacent)}
      {allBookData.map((bookData) => (
        <GridCard data={getGridCardData(bookData)} key={bookData.id} />
      ))}
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
