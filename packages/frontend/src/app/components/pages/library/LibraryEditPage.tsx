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
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';
import { withParameterPath } from 'app/helpers/path/parameters';

import { CurrentBookData } from 'app/modules/library/types/CurrentBookData';
import { librarySelector } from 'app/modules/library/librarySelector';
import { libraryAction } from 'app/modules/library/libraryAction';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getSelectFormItem } from 'app/components/blocks/card-items/items-form/select/getSelectFormItem';
import { getMultiSelectFormItem } from 'app/components/blocks/card-items/items-form/multi-select/getMultiSelectFormItem';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getRatingFormItem } from 'app/components/blocks/card-items/items-form/rating/getRatingFormItem';
import { getSubHeader } from '../../blocks/card-items/items-shared/subheader/getSubHeader';


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

  const { subHeaders } = PageMessages.bookDetail;

  const authorItems = data.authors.map((author, index) => (
    getTextFormItem({
      label: index === 0 ? subHeaders.bookData.authorName : null,
      value: author.name,
      readOnly: true,
    })
  ));

  const cardData: EditCardData = {
    header: getCardHeader(PageMessages.bookDetail.editHeader, BookSharp),
    items: [
      getSubHeader(subHeaders.bookData.header),
      getTextFormItem({
        label: subHeaders.bookData.bookName,
        value: data.book.name,
        readOnly: true,
      }),
      ...authorItems,
      getTextFormItem({
        label: subHeaders.bookData.publisher,
        value: bookDataUpdate.publisher,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'publisher'),
      }),
      getTextFormItem({
        label: subHeaders.bookData.yearPublished,
        value: bookDataUpdate.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'yearPublished'),
      }),
      getTextFormItem({
        label: subHeaders.bookData.isbn,
        value: bookDataUpdate.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'isbn'),
      }),
      getSelectFormItem<number>({
        label: subHeaders.bookData.genre,
        value: bookDataUpdate.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'genreId'),
        convert: Number,
      }),
      getSelectFormItem<Format>({
        label: subHeaders.bookData.format,
        value: bookDataUpdate.format,
        options: Object.values(Format).map((format) => ({ name: format, value: format })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'format'),
        convert: (value) => (String(value) as Format),
      }),

      getSubHeader(subHeaders.personalBookData.header),
      getDateFormItem({
        label: subHeaders.personalBookData.read,
        value: personalBookDataUpdate.dateRead,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'dateRead'),
      }),
      getTextFormItem({
        label: subHeaders.personalBookData.comment,
        value: personalBookDataUpdate.comment,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'comment'),
      }),

      getSubHeader(subHeaders.review.header),
      getRatingFormItem({
        label: subHeaders.review.stars,
        value: reviewUpdate.stars,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'stars'),
      }),
      getTextFormItem({
        label: subHeaders.review.comment,
        value: reviewUpdate.comment,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'comment'),
      }),

      getSubHeader(subHeaders.labels),
      getMultiSelectFormItem({
        label: null,
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
          props.history.push(withParameterPath(LibraryPath.bookDetail, pathId));
        },
      }),
    ],
  };

  return (
    <FormCard data={cardData} />
  );
};

export const LibraryEditPage = connect<StateProps, DispatchProps, {}, AppState>(
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
