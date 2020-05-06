import React, { ReactElement } from 'react';

import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';
import { isNull } from 'book-app-shared/helpers/typeChecks';
import { dataToMessage } from 'app/helpers/dataToMessage';


export type ItemData<T extends {}> = {
  label: string;
  value: T[keyof T];
};

const BaseCardItem = <T extends {}>({ label, value }: ItemData<T>): JSX.Element => {
  const classes = useCardItemStyle();
  return (
    <div className={classes.item}>
      <div className={classes.subHeader}>{label}</div>
      <div>{dataToMessage(value)}</div>
    </div>
  );
};

export type CardItemType<T> = ReactElement<ItemData<T>>;

export const getCardItem = <T extends {}>(
  data: ItemData<T>,
): CardItemType<T> | null => {
  if (isNull(data)) return null;
  return (
    <BaseCardItem label={data.label} value={data.value} />
  );
};
