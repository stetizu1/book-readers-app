import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LabelSharp } from '@material-ui/icons';

import { Label, LabelUpdate } from 'book-app-shared/types/Label';
import { isEmptyObject } from 'book-app-shared/helpers/validators';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';


import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';
import { IdMapOptional } from 'app/types/IdMap';

import { getUpdateValue } from 'app/helpers/updateValue';

import { librarySelector } from 'app/modules/library/librarySelector';
import { libraryAction } from 'app/modules/library/libraryAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';
import { NotFoundError } from 'app/components/blocks/errors/NotFoundError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { convertLabelToLabelUpdate } from 'book-app-shared/helpers/convert-to-update/label';


interface StateProps {
  labels: IdMapOptional<Label> | undefined;
}

interface DispatchProps {
  updateLabel: typeof libraryAction.startUpdateLabel;
}

type Props = StateProps & DispatchProps;

const messages = PageMessages.labels;

const BaseLabelEditPage: FC<Props> = ({ labels, updateLabel }) => {
  const { id: anyId } = useParams();
  const pathId = Number(anyId);

  const [labelUpdate, setLabelUpdate] = useState<LabelUpdate>({});

  if (isUndefined(labels)) {
    return <UnknownError />;
  }

  const currentLabel = labels[pathId];

  if (isUndefined(currentLabel)) {
    return <NotFoundError />;
  }

  if (isEmptyObject(labelUpdate)) {
    const defaultState = convertLabelToLabelUpdate(currentLabel);
    setLabelUpdate(defaultState);
  }

  const cardData: EditCardData = {
    header: getCardHeader(messages.editHeader, LabelSharp),
    items: [
      getTextFormItem({
        label: messages.labels.name,
        value: currentLabel.name,
        readOnly: true,
      }),
      getTextFormItem({
        label: messages.labels.description,
        value: labelUpdate.description,
        multiline: true,
        updateValueFunction: getUpdateValue(labelUpdate, setLabelUpdate, 'description'),
      }),
    ],
    onSubmit: () => {
      updateLabel(pathId, labelUpdate);
    },
    isGoingBackOnSubmit: true,
  };

  return (
    <FormCard data={cardData} />
  );
};

export const LabelEditPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    labels: librarySelector.getAllLabelsMap(state),
  }),
  {
    updateLabel: libraryAction.startUpdateLabel,
  },
)(withLoading(
  BaseLabelEditPage,
  librarySelector.getAllLabelsStatus,
));
