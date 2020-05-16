import React, { FC, Fragment, ReactElement } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Paper } from '@material-ui/core';

import { ButtonComponentType, getButton } from 'app/components/blocks/card-items/button/getButton';

import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';

import { useFormCardStyle } from './useFormCardStyle';
import { ButtonType } from '../../../../constants/style/types/ButtonType';
import { ButtonMessage } from '../../../../messages/ButtonMessage';
import { ButtonLayoutType } from '../../../../constants/style/types/ButtonLayoutType';


export interface EditCardData {
  header?: HeaderComponentType;
  items?: ReactElement[];
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: EditCardData;
}

type Props = InputProps & RouteComponentProps;

export const BasicFormCard: FC<Props> = (props) => {
  const classes = useFormCardStyle();

  const {
    header = null,
    items = [],
    buttons = [],
  } = props.data;

  const editButtons = [
    getButton({
      buttonType: ButtonType.cancel,
      label: ButtonMessage.back,
      onClick: () => props.history.goBack(),
    }),
    ...buttons,
  ];

  return (
    <Paper className={classes.paper}>
      {header}
      <form autoComplete="off" className={classes.content}>
        {items.map((item, index) => (
          <Fragment key={`${item.props.label}-${index}`}>
            {item}
          </Fragment>
        ))}
      </form>
      {getButtonsLayout(editButtons, ButtonLayoutType.opposite)}
    </Paper>
  );
};

export const FormCard = withRouter(BasicFormCard);
