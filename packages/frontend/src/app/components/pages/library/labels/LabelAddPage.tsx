import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { LabelSharp } from '@material-ui/icons';

import { LabelCreate } from 'book-app-shared/types/Label';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { getUpdateValue } from 'app/helpers/updateValue';
import { getNamedCreateDefault } from 'app/helpers/form/create-default/named';

import { libraryAction } from 'app/modules/library/libraryAction';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';


interface DispatchProps {
  createLabel: typeof libraryAction.startCreateLabel;
}

type Props = DispatchProps;

const messages = PageMessages.labels;

const BaseLabelAddPage: FC<Props> = ({ createLabel }) => {
  const [labelCreate, setLabelCreate] = useState<LabelCreate>(getNamedCreateDefault());

  const cardData: EditCardData = {
    header: getCardHeader(messages.addHeader, LabelSharp),
    items: [
      getTextFormItem({
        label: messages.labels.name,
        value: labelCreate.name,
        required: true,
        updateValueFunction: getUpdateValue(labelCreate, setLabelCreate, 'name'),
      }),
      getTextFormItem({
        label: messages.labels.description,
        value: labelCreate.description,
        multiline: true,
        updateValueFunction: getUpdateValue(labelCreate, setLabelCreate, 'description'),
      }),
    ],
    onSubmit: () => {
      createLabel(labelCreate);
    },
    isGoingBackOnSubmit: true,
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
)(BaseLabelAddPage);
