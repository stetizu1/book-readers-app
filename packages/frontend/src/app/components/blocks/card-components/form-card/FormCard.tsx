import React, { FC, Fragment, ReactElement } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Paper } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { ButtonMessage } from 'app/messages/ButtonMessage';

import { OnSubmitType } from 'app/types/EventTypes';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';

import { useFormCardStyle } from './useFormCardStyle';


export interface EditCardData {
  header?: HeaderComponentType;
  items?: ReactElement[];
  submitLabel?: ButtonMessage;
  onSubmit?: OnSubmitType;
  isGoingBackOnSubmit?: boolean;
}

interface InputProps {
  data: EditCardData;
}

type Props = InputProps & RouteComponentProps;

export const BasicFormCard: FC<Props> = ({ history, data }) => {
  const classes = useFormCardStyle();

  const {
    header = null,
    items = [],
    onSubmit,
    submitLabel,
    isGoingBackOnSubmit = false,
  } = data;

  const onSubmitPreventing: OnSubmitType | undefined = !isUndefined(onSubmit) ? (event): void => {
    onSubmit(event);
    event.preventDefault();
    if (isGoingBackOnSubmit) history.goBack();
  } : undefined;

  const editButtons = [
    getButton({
      buttonType: ButtonType.cancel,
      label: ButtonMessage.Back,
      onClick: () => history.goBack(),
    }),
    getButton({
      buttonType: ButtonType.save,
      label: submitLabel,
      isSubmit: true,
    }),
  ];

  return (
    <Paper className={classes.paper}>
      {header}
      <form autoComplete="off" id="form" onSubmit={onSubmitPreventing}>
        <div className={classes.content}>
          {items.map((item, index) => (
            <Fragment key={`${item.props.label}-${index}`}>
              {item}
            </Fragment>
          ))}
        </div>
        {getButtonsLayout(editButtons, ButtonLayoutType.opposite)}
      </form>
    </Paper>
  );
};

export const FormCard = withRouter(BasicFormCard);
