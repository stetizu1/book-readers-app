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
import { yearRegExp } from 'book-app-shared/constants/regexp';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { MenuPath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { FormatMessage } from 'app/messages/FormatMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';
import { getNamedCreateDefault } from 'app/helpers/form/create-default/named';
import { getBookDataCreateDefault } from 'app/helpers/form/create-default/bookData';

import { userSelector } from 'app/modules/user/userSelector';
import { libraryAction } from 'app/modules/library/libraryAction';
import { librarySelector } from 'app/modules/library/librarySelector';

import { withLoading } from 'app/components/wrappers/withLoading';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getSubHeader } from 'app/components/blocks/card-items/items-shared/subheader/getSubHeader';
import { getDateFormItem } from 'app/components/blocks/card-items/items-form/date/getDateFormItem';
import { getRatingFormItem } from 'app/components/blocks/card-items/items-form/rating/getRatingFormItem';
import { getMultiSelectFormItem } from 'app/components/blocks/card-items/items-form/multi-select/getMultiSelectFormItem';
import { getNumberSelectWithUndefinedFormItem } from '../../blocks/card-items/items-form/select/number-with-undefined/getNumberSelectWithUndefinedFormItem';
import { getFormatSelectWithUndefinedFormItem } from '../../blocks/card-items/items-form/select/format-with-undefined/getFormatSelectWithUndefinedFormItem';


interface StateProps {
  genres: Genre[] | undefined;
  labels: IdMap<Label> | undefined;
}

interface DispatchProps {
  startCreateBook: typeof libraryAction.startCreateBookData;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

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
    return null;
  }
  const { subHeaders } = PageMessages.bookDetail;

  const cardData: EditCardData = {
    header: getCardHeader(PageMessages.bookDetail.createHeader, BookSharp),
    items: [
      getSubHeader(subHeaders.bookData.header),
      getTextFormItem({
        label: subHeaders.bookData.bookName,
        required: true,
        value: bookCreateSimple.name,
        updateValueFunction: getUpdateValue(bookCreateSimple, setBookCreate, 'name'),
      }),
      getTextFormItem({
        label: subHeaders.bookData.authorName,
        required: true,
        value: author.name,
        updateValueFunction: getUpdateValue(author, setAuthor, 'name'),
      }),
      // todo more authors
      getTextFormItem({
        label: subHeaders.bookData.publisher,
        value: bookDataCreateSimple.publisher,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'publisher'),
      }),
      getTextFormItem({
        label: subHeaders.bookData.yearPublished,
        value: bookDataCreateSimple.yearPublished,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'yearPublished'),
      }),
      getTextFormItem({
        label: subHeaders.bookData.isbn,
        value: bookDataCreateSimple.isbn,
        regexp: yearRegExp,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'isbn'),
      }),
      getNumberSelectWithUndefinedFormItem({
        label: subHeaders.bookData.genre,
        value: bookDataCreateSimple.genreId,
        options: genres.map((genre) => ({ name: genre.name, value: genre.id })),
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'genreId'),
      }),
      getFormatSelectWithUndefinedFormItem({
        label: subHeaders.bookData.format,
        value: bookDataCreateSimple.format,
        options: Object.values(Format).map((format) => ({ name: FormatMessage[format], value: format })),
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'format'),
      }),

      getSubHeader(subHeaders.personalBookData.header),
      getDateFormItem({
        label: subHeaders.personalBookData.read,
        value: personalBookData.dateRead,
        updateValueFunction: getUpdateValue(personalBookData, setPersonalBookData, 'dateRead'),
      }),
      getTextFormItem({
        label: subHeaders.personalBookData.comment,
        value: personalBookData.comment,
        updateValueFunction: getUpdateValue(personalBookData, setPersonalBookData, 'comment'),
      }),

      getSubHeader(subHeaders.review.header),
      getRatingFormItem({
        label: subHeaders.review.stars,
        value: review.stars,
        updateValueFunction: getUpdateValue(review, setReview, 'stars'),
      }),
      getTextFormItem({
        label: subHeaders.review.comment,
        value: review.comment,
        updateValueFunction: getUpdateValue(review, setReview, 'comment'),
      }),

      getSubHeader(subHeaders.labels),
      getMultiSelectFormItem({
        label: null,
        value: bookDataCreateSimple.labelsIds,
        labelMap: labels,
        updateValueFunction: getUpdateValue(bookDataCreateSimple, setBookDataCreate, 'labelsIds'),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        onClick: (): void => {
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
      }),
    ],
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
)(withRouter(withLoading(BaseLibraryAddPage, userSelector.getCurrentUserStatus)));
