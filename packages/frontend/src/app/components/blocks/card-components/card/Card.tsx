import React, { FC } from 'react';
import { Paper } from '@material-ui/core';

import { PositionType } from 'app/constants/style/types/PositionType';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';


import { getItemsGroup } from '../../card-layout/body/items-group/getItemsGroup';
import { getButtonsLayout } from '../../card-layout/buttons/getButtonsLayout';
import { HeaderComponentType } from '../../card-layout/header/getCardHeader';
import { useCardStyle } from './useCardStyle';


export interface CardData {
  header?: HeaderComponentType;
  items?: JSX.Element[];
  buttons?: ButtonComponentType[];
}

interface InputProps {
  data: CardData;
}

type Props = InputProps;

export const Card: FC<Props> = (props) => {
  const classes = useCardStyle();

  const {
    header = null,
    items = [],
    buttons = [],
  } = props.data;

  return (
    <Paper className={classes.paper}>
      {header}
      <div className={classes.content}>
        {getItemsGroup(items, PositionType.topLeft)}
      </div>
      {getButtonsLayout(buttons, ButtonLayoutType.opposite)}
    </Paper>
  );
};
