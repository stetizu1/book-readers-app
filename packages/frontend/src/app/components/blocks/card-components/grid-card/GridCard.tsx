import React, { FC } from 'react';
import { Paper } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { PositionType } from 'app/constants/style/types/PositionType';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';
import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';

import { getItemsGroup } from 'app/components/blocks/card-layout/body/items-group/getItemsGroup';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';

import { useGridStyle } from './useGridStyle';


export interface GridCardData {
  header?: HeaderComponentType;

  topLeftItems?: JSX.Element[];
  bottomLeftItems?: JSX.Element[];
  topRightItems?: JSX.Element[];
  bottomRightItems?: JSX.Element[];

  buttons?: ButtonComponentType[];
  deleteButton?: ButtonComponentType;
}

interface InputProps {
  data: GridCardData;
}

type Props = InputProps;

export const GridCard: FC<Props> = (props) => {
  const classes = useGridStyle();

  const {
    header = null,
    topLeftItems = [],
    topRightItems = [],
    bottomLeftItems = [],
    bottomRightItems = [],
    buttons = [],
    deleteButton,
  } = props.data;

  const isRenderedLeft = !!topLeftItems.length || !!bottomLeftItems.length;
  const isRenderedRight = !!topRightItems.length || !!bottomRightItems.length;

  const buttonsLayout = isUndefined(deleteButton) ? getButtonsLayout(buttons) : getButtonsLayout(
    [deleteButton, ...buttons],
    ButtonLayoutType.oneAndOpposite,
  );

  return (
    <Paper className={classes.paper}>
      {header}
      <div className={classes.gridContainer}>
        {isRenderedLeft && (
          <div className={classes.column}>
            {getItemsGroup(topLeftItems, PositionType.topLeft)}
            {getItemsGroup(bottomLeftItems, PositionType.bottomLeft)}
          </div>
        )}
        {isRenderedRight && (
          <div className={classes.column}>
            {getItemsGroup(topRightItems, PositionType.topRight)}
            {getItemsGroup(bottomRightItems, PositionType.bottomRight)}
          </div>
        )}
      </div>
      {buttonsLayout}
    </Paper>
  );
};
