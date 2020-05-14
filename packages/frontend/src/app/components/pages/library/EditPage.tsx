import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, useParams } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { Format } from 'book-app-shared/types/enums/Format';
import { Label } from 'book-app-shared/types/Label';
import { BookDataUpdate } from 'book-app-shared/types/BookData';
import { PersonalBookDataUpdate } from 'book-app-shared/types/PersonalBookData';
import { ReviewUpdate } from 'book-app-shared/types/Review';
import { Genre } from 'book-app-shared/types/Genre';

import { yearRegExp } from 'book-app-shared/constants/regexp';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isEmptyObject } from 'book-app-shared/helpers/validators';
import { convertBookDataToBookDataUpdate } from 'book-app-shared/helpers/convert-to-update/bookData';
import { convertPersonalBookDataToPersonalBookDataUpdate } from 'book-app-shared/helpers/convert-to-update/personalBookData';
import { convertReviewToReviewUpdate } from 'book-app-shared/helpers/convert-to-update/review';


import { LibraryPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';
import { withParameterPath } from 'app/helpers/path/parameters';

import { CurrentBookData } from 'app/modules/library/types/CurrentBookData';
import { librarySelector } from 'app/modules/library/librarySelector';
import { libraryAction } from 'app/modules/library/libraryAction';

import { EditCardComponent, EditCardData } from 'app/components/blocks/EditCardComponent';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getHeader } from 'app/components/blocks/card-components/header/getHeader';
import { getSelectFormItem } from 'app/components/blocks/card-items/items-form/select/getSelectFormItem';
import { getMultiSelectFormItem } from 'app/components/blocks/card-items/items-form/multi-select/getMultiSelectFormItem';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getRatingFormItem } from 'app/components/blocks/card-items/items-form/rating/getRatingFormItem';
import { useContainerStyle } from 'app/components/blocks/styles/ContainerStyle';


interface StateProps {
  data: CurrentBookData | undefined;
  genres: Genre[] | undefined;
  labels: IdMap<Label> | undefined;
}

interface DispatchProps {
  startGetBookData: typeof libraryAction.startGetBookData;
  updateBookData: typeof libraryAction.startUpdateBookData;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const BaseEditProfilePage: FC<Props> = (props) => {
  const classes = useContainerStyle();
  const {
    data,
    genres,
    labels,
    startGetBookData,
    updateBookData,
  } = props;

  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const [bookDataUpdate, setBookDataUpdate] = useState<BookDataUpdate>({});
  const [personalBookDataUpdate, setPersonalBookDataUpdate] = useState<PersonalBookDataUpdate>({});
  const [reviewUpdate, setReviewUpdate] = useState<ReviewUpdate>({});


  if (isUndefined(labels) || isUndefined(genres)) {
    return null;
  }

  if (isUndefined(data) || data.bookData.id !== Number(pathId)) {
    startGetBookData(pathId);
    return null;
  }

  if (isEmptyObject(bookDataUpdate)) {
    const defaultBookDataUpdate = convertBookDataToBookDataUpdate(data.bookData);
    const defaultPersonalBookDataUpdate = convertPersonalBookDataToPersonalBookDataUpdate(data.personalBookData);
    const defaultReviewUpdate = convertReviewToReviewUpdate(data.review);
    setBookDataUpdate(defaultBookDataUpdate);
    setPersonalBookDataUpdate(defaultPersonalBookDataUpdate);
    setReviewUpdate(defaultReviewUpdate);
  }


  const authorItems = data.authors.map((author, index) => (
    getTextFormItem({
      label: index === 0 ? PageMessages.bookDetail.subHeaders.bookData.authorName : null,
      value: author.name,
      readOnly: true,
    })
  ));

  const cardData: EditCardData = {
    header: getHeader(PageMessages.bookDetail.editHeader, BookSharp),
    items: [
      getTextFormItem({
        label: PageMessages.bookDetail.subHeaders.bookData.bookName,
        value: data.book.name,
        readOnly: true,
      }),
      ...authorItems,
      getTextFormItem({
        label: PageMessages.bookDetail.subHeaders.bookData.publisher,
        value: bookDataUpdate.publisher,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'publisher'),
      }),
      getTextFormItem({
        label: PageMessages.bookDetail.subHeaders.bookData.yearPublished,
        value: bookDataUpdate.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'yearPublished'),
      }),
      getTextFormItem({
        label: PageMessages.bookDetail.subHeaders.bookData.isbn,
        value: bookDataUpdate.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'isbn'),
      }),
      getSelectFormItem<number>({
        label: PageMessages.bookDetail.subHeaders.bookData.genre,
        value: bookDataUpdate.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'genreId'),
        convert: Number,
      }),
      getSelectFormItem<Format>({
        label: PageMessages.bookDetail.subHeaders.bookData.format,
        value: bookDataUpdate.format,
        options: Object.values(Format).map((format) => ({ name: format, value: format })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'format'),
        convert: (value) => (String(value) as Format),
      }),
      getDateFormItem({
        label: PageMessages.bookDetail.subHeaders.personalBookData.read,
        value: personalBookDataUpdate.dateRead,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'dateRead'),
      }),
      getTextFormItem({
        label: PageMessages.bookDetail.subHeaders.personalBookData.comment,
        value: personalBookDataUpdate.comment,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'comment'),
      }),
      getRatingFormItem({
        label: PageMessages.bookDetail.subHeaders.review.stars,
        value: reviewUpdate.stars,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'stars'),
      }),
      getTextFormItem({
        label: PageMessages.bookDetail.subHeaders.review.comment,
        value: reviewUpdate.comment,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'comment'),
      }),
      getMultiSelectFormItem({
        label: PageMessages.bookDetail.subHeaders.labels,
        value: bookDataUpdate.labelsIds,
        labelMap: labels,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'labelsIds'),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        onClick: (): void => {
          updateBookData(pathId, { bookDataUpdate, personalBookDataUpdate, reviewUpdate });
          props.history.push(withParameterPath(LibraryPath.detailBookData, pathId));
        },
      }),
    ],
  };

  return (
    <>
      <div className={classes.container}>
        <EditCardComponent data={cardData} />
      </div>
    </>
  );
};

export const EditPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    data: librarySelector.getCurrentBookData(state),
    genres: librarySelector.getAllGenres(state),
    labels: librarySelector.getAllLabelsMap(state),
  }),
  {
    startGetBookData: libraryAction.startGetBookData,
    updateBookData: libraryAction.startUpdateBookData,
  },
)(withRouter(BaseEditProfilePage));
