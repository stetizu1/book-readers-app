import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { BookSharp } from '@material-ui/icons';

import { Format } from 'book-app-shared/types/enums/Format';
import { Genre } from 'book-app-shared/types/Genre';
import { Label } from 'book-app-shared/types/Label';
import { PersonalBookDataUpdate } from 'book-app-shared/types/PersonalBookData';
import { ReviewUpdate } from 'book-app-shared/types/Review';
import { BookDataCreateSimple } from 'book-app-shared/types/BookData';
import { nameRegExp, yearRegExp } from 'book-app-shared/constants/regexp';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { FormatMessage } from 'app/messages/FormatMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';
import { getNamedCreateDefault } from 'app/helpers/form/create-default/named';
import { getBookDataCreateDefault } from 'app/helpers/form/create-default/bookData';

import { libraryAction } from 'app/modules/library/libraryAction';
import { librarySelector } from 'app/modules/library/librarySelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getRatingFormItem } from 'app/components/blocks/card-items/items-form/rating/getRatingFormItem';
import { getMultiSelectFormItem } from 'app/components/blocks/card-items/items-form/multi-select/getMultiSelectFormItem';
import { getNumberSelectWithUndefinedFormItem } from 'app/components/blocks/card-items/items-form/select/number-with-undefined/getNumberSelectWithUndefinedFormItem';
import { getFormatSelectWithUndefinedFormItem } from 'app/components/blocks/card-items/items-form/select/format-with-undefined/getFormatSelectWithUndefinedFormItem';


interface StateProps {
  genres: Genre[] | undefined;
  labels: IdMap<Label> | undefined;
}

interface DispatchProps {
  startCreateBook: typeof libraryAction.startCreateBookData;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const messages = PageMessages.library;
const [bookDataSubHeader, personalBookDataSubHeader, reviewSubHeader, labelsSubHeader] = [messages.subHeaders.bookData, messages.subHeaders.personalBookData, messages.subHeaders.review, messages.subHeaders.labels];
const [bookDataLabels, personalBookDataLabels, reviewLabels] = [messages.labels.bookData, messages.labels.personalBookData, messages.labels.review];

const BaseLibraryAddPage: FC<Props> = (props) => {
  const [bookCreateSimple, setBookCreate] = useState<{ name: string }>(getNamedCreateDefault);
  const [author, setAuthor] = useState<{ name: string }>(getNamedCreateDefault);
  const [bookDataCreateSimple, setBookDataCreate] = useState<BookDataCreateSimple>(getBookDataCreateDefault);
  const [personalBookData, setPersonalBookData] = useState<PersonalBookDataUpdate>({});
  const [review, setReview] = useState<ReviewUpdate>({});

  const {
    genres, labels, startCreateBook, history,
  } = props;

  if (isUndefined(labels) || isUndefined(genres)) {
    return <UnknownError />;
  }

  const cardData: EditCardData = {
    header: getCardHeader(messages.addHeader, BookSharp),
    items: [
      getSubHeader(bookDataSubHeader),
      getTextFormItem({
        label: bookDataLabels.bookName,
        required: true,
        value: bookCreateSimple.name,
        updateValueFunction: getUpdateValue(bookCreateSimple, setBookCreate, 'name'),
      }),
      getTextFormItem({
        label: bookDataLabels.authorName,
        required: true,
        value: author.name,
        updateValueFunction: getUpdateValue(author, setAuthor, 'name'),
      }),
      // todo more authors
      getTextFormItem({
        label: bookDataLabels.publisher,
        value: bookDataCreateSimple.publisher,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'publisher'),
      }),
      getTextFormItem({
        label: bookDataLabels.yearPublished,
        value: bookDataCreateSimple.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'yearPublished'),
      }),
      getTextFormItem({
        label: bookDataLabels.isbn,
        value: bookDataCreateSimple.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'isbn'),
      }),
      getNumberSelectWithUndefinedFormItem({
        label: bookDataLabels.genre,
        value: bookDataCreateSimple.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'genreId'),
      }),
      getFormatSelectWithUndefinedFormItem({
        label: bookDataLabels.format,
        value: bookDataCreateSimple.format,
        options: Object.values(Format).map((format) => ({ name: FormatMessage[format], value: format })),
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'format'),
      }),

      getSubHeader(personalBookDataSubHeader),
      getDateFormItem({
        label: personalBookDataLabels.dateRead,
        value: personalBookData.dateRead,
        updateValueFunction: getUpdateValue(personalBookData, setPersonalBookData, 'dateRead'),
      }),
      getTextFormItem({
        label: personalBookDataLabels.comment,
        value: personalBookData.comment,
        updateValueFunction: getUpdateValue(personalBookData, setPersonalBookData, 'comment'),
      }),

      getSubHeader(reviewSubHeader),
      getRatingFormItem({
        label: reviewLabels.stars,
        value: review.stars,
        updateValueFunction: getUpdateValue(review, setReview, 'stars'),
      }),
      getTextFormItem({
        label: reviewLabels.comment,
        value: review.comment,
        updateValueFunction: getUpdateValue(review, setReview, 'comment'),
      }),

      getSubHeader(labelsSubHeader),
      getMultiSelectFormItem({
        label: null,
        value: bookDataCreateSimple.labelsIds,
        labelMap: labels,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'labelsIds'),
      }),
    ],
    onSubmit: () => {
      const bookCreate = {
        ...bookCreateSimple,
        authors: [
          author,
        ],
      };
      const bookDataCreate = {
        ...bookDataCreateSimple,
        personalBookData,
        review,
      };

      startCreateBook({ bookCreate, bookDataCreate });
      history.push(MenuPath.library);
    },
  };

  return (
    <FormCard data={cardData} />
  );
};

export const LibraryAddPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    genres: librarySelector.getAllGenres(state),
    labels: librarySelector.getAllLabelsMap(state),
  }),
  {
    startCreateBook: libraryAction.startCreateBookData,
  },
)(withRouter(withLoading(
  BaseLibraryAddPage,
  librarySelector.getAllGenresStatus,
  librarySelector.getAllLabelsStatus,
)));
