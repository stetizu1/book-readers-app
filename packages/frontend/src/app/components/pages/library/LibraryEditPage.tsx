import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
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
import { isStatus, Status } from 'app/constants/Status';

import { PageMessages } from 'app/messages/PageMessages';
import { FormatMessage } from 'app/messages/FormatMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';
import { withParameterPath } from 'app/helpers/path/parameters';

import { CurrentBookData } from 'app/modules/library/types/CurrentBookData';
import { librarySelector } from 'app/modules/library/librarySelector';
import { libraryAction } from 'app/modules/library/libraryAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getMultiSelectFormItem } from 'app/components/blocks/card-items/items-form/multi-select/getMultiSelectFormItem';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getRatingFormItem } from 'app/components/blocks/card-items/items-form/rating/getRatingFormItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getNumberSelectNullableFormItem } from 'app/components/blocks/card-items/items-form/select/number-nullable/getNumberSelectNullableFormItem';
import { getFormatSelectNullableFormItem } from 'app/components/blocks/card-items/items-form/select/format-nullable/getFormatSelectNullableFormItem';


interface StateProps {
  lastSearchedId: number | undefined;
  status: Status<CurrentBookData>;
  data: CurrentBookData | undefined;
  genres: Genre[] | undefined;
  labels: IdMap<Label> | undefined;
}

interface DispatchProps {
  startReadBookData: typeof libraryAction.startReadBookData;
  updateBookData: typeof libraryAction.startUpdateBookData;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const messages = PageMessages.library;
const [bookDataSubHeader, personalBookDataSubHeader, reviewSubHeader, labelsSubHeader] = [messages.subHeaders.bookData, messages.subHeaders.personalBookData, messages.subHeaders.review, messages.subHeaders.labels];
const [bookDataLabels, personalBookDataLabels, reviewLabels] = [messages.labels.bookData, messages.labels.personalBookData, messages.labels.review];

const BaseEditProfilePage: FC<Props> = (props) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const {
    data, status, lastSearchedId,
    genres,
    labels,
    startReadBookData,
    updateBookData,
    history,
  } = props;

  const [bookDataUpdate, setBookDataUpdate] = useState<BookDataUpdate>({});
  const [personalBookDataUpdate, setPersonalBookDataUpdate] = useState<PersonalBookDataUpdate>({});
  const [reviewUpdate, setReviewUpdate] = useState<ReviewUpdate>({});


  if (isUndefined(labels) || isUndefined(genres)) {
    return <UnknownError />;
  }
  if (lastSearchedId !== pathId) {
    startReadBookData(pathId);
  }

  if (isStatus.failure(status)) {
    return <NotFoundError />;
  }

  if (isUndefined(data) || data.bookData.id !== pathId) {
    return <CircularProgress />;
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
      label: index === 0 ? bookDataLabels.authorName : null,
      value: author.name,
      readOnly: true,
    })
  ));

  const cardData: EditCardData = {
    header: getCardHeader(messages.editHeader, BookSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getTextFormItem({
        label: bookDataLabels.bookName,
        value: data.book.name,
        readOnly: true,
      }),
      ...authorItems,
      getTextFormItem({
        label: bookDataLabels.publisher,
        value: bookDataUpdate.publisher,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'publisher'),
      }),
      getTextFormItem({
        label: bookDataLabels.yearPublished,
        value: bookDataUpdate.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'yearPublished'),
      }),
      getTextFormItem({
        label: bookDataLabels.isbn,
        value: bookDataUpdate.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'isbn'),
      }),
      getNumberSelectNullableFormItem({
        label: bookDataLabels.genre,
        value: bookDataUpdate.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'genreId'),
      }),
      getFormatSelectNullableFormItem({
        label: bookDataLabels.format,
        value: bookDataUpdate.format,
        options: Object.values(Format).map((format) => ({ name: FormatMessage[format], value: format })),
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'format'),
      }),

      getSubHeader(personalBookDataSubHeader),
      getDateFormItem({
        label: personalBookDataLabels.dateRead,
        value: personalBookDataUpdate.dateRead,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'dateRead'),
      }),
      getTextFormItem({
        label: personalBookDataLabels.comment,
        value: personalBookDataUpdate.comment,
        updateValueFunction: getUpdateValue(personalBookDataUpdate, setPersonalBookDataUpdate, 'comment'),
      }),

      getSubHeader(reviewSubHeader),
      getRatingFormItem({
        label: reviewLabels.stars,
        value: reviewUpdate.stars,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'stars'),
      }),
      getTextFormItem({
        label: reviewLabels.comment,
        value: reviewUpdate.comment,
        updateValueFunction: getUpdateValue(reviewUpdate, setReviewUpdate, 'comment'),
      }),

      getSubHeader(labelsSubHeader),
      getMultiSelectFormItem({
        label: null,
        value: bookDataUpdate.labelsIds,
        labelMap: labels,
        updateValueFunction: getUpdateValue(bookDataUpdate, setBookDataUpdate, 'labelsIds'),
      }),
    ],
    onSubmit: () => {
      updateBookData(pathId, { bookDataUpdate, personalBookDataUpdate, reviewUpdate });
      history.push(withParameterPath(LibraryPath.bookDetail, pathId));
    },
  };

  return (
    <FormCard data={cardData} />
  );
};

export const LibraryEditPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    lastSearchedId: librarySelector.getLastSearchedBookDataId(state),
    status: librarySelector.getSearchedBookDataStatus(state),
    data: librarySelector.getSearchedBookData(state),
    genres: librarySelector.getAllGenres(state),
    labels: librarySelector.getAllLabelsMap(state),
  }),
  {
    startReadBookData: libraryAction.startReadBookData,
    updateBookData: libraryAction.startUpdateBookData,
  },
)(withRouter(withLoading(
  BaseEditProfilePage,
  librarySelector.getSearchedBookDataStatus,
  librarySelector.getAllGenresStatus,
  librarySelector.getAllLabelsStatus,
)));
