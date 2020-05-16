import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { LabelSharp } from '@material-ui/icons';

import { LabelCreate } from 'book-app-shared/types/Label';


import { LibraryPath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { getUpdateValue } from 'app/helpers/updateValue';
import { getNamedCreateDefault } from 'app/helpers/form/create-default/named';

import { libraryAction } from 'app/modules/library/libraryAction';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';


interface DispatchProps {
  createLabel: typeof libraryAction.startCreateLabel;
}

type Props = RouteComponentProps & DispatchProps;

const BaseLabelAddPage: FC<Props> = ({ createLabel, history }) => {
  const [labelCreate, setLabelCreate] = useState<LabelCreate>(getNamedCreateDefault());

  const cardData: EditCardData = {
    header: getCardHeader(PageMessages.labels.addHeader, LabelSharp),
    items: [
      getTextFormItem({
        label: PageMessages.labels.name,
        value: labelCreate.name,
        updateValueFunction: getUpdateValue(labelCreate, setLabelCreate, 'name'),
      }),
      getTextFormItem({
        label: PageMessages.labels.description,
        value: labelCreate.description,
        updateValueFunction: getUpdateValue(labelCreate, setLabelCreate, 'description'),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        onClick: (): void => {
          createLabel(labelCreate);
          history.push(LibraryPath.labels);
        },
      }),
    ],
  };

  return (
    <FormCard data={cardData} />
  );
};

export const LabelAddPage = connect<{}, DispatchProps, {}, AppState>(
  null,
  {
    createLabel: libraryAction.startCreateLabel,
  },
)(withRouter(BaseLabelAddPage));
