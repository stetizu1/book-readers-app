import React, { FC } from 'react';
import { Paper } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { PositionType } from 'app/constants/style/types/PositionType';

import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';
import { HeaderComponentType } from 'app/components/blocks/card-layout/header/getCardHeader';
import { EmptyComponent } from 'app/components/blocks/empty/EmptyComponent';
import { getItemsGroup } from 'app/components/blocks/card-layout/body/items-group/getItemsGroup';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';

import { useDoubleCardStyle } from './useDoubleCardStyle';


export interface DoubleCardData {
  header: HeaderComponentType;
  itemsLeft?: JSX.Element[];
  itemsRight?: JSX.Element[];
  button: (ButtonComponentType | JSX.Element);
  emptyMessage?: string;
  emptyButton?: (ButtonComponentType | JSX.Element);
}

interface InputProps {
  data: DoubleCardData;
}

type Props = InputProps;

export const DoubleCard: FC<Props> = ({ data }) => {
  const classes = useDoubleCardStyle();

  const {
    header,
    itemsLeft,
    itemsRight,
    button,
    emptyButton,
    emptyMessage,
  } = data;

  if (isUndefined(itemsLeft)) {
    return (
      <EmptyComponent button={emptyButton || button} message={emptyMessage} header={header} />
    );
  }

  const leftItem = getItemsGroup(itemsLeft, PositionType.topLeft);
  const rightItem = isUndefined(itemsRight) ? null : getItemsGroup(itemsRight, PositionType.topLeft);

  return (
    <Paper className={classes.paper}>
      <div className={classes.container}>
        {header}
        <div className={classes.sideBySide}>
          <div className={classes.content}>
            {leftItem}
          </div>
          {itemsRight && (
            <div className={classes.content}>
              {rightItem}
            </div>
          )}
        </div>
        {getButtonsLayout([button])}
      </div>
    </Paper>
  );
};
