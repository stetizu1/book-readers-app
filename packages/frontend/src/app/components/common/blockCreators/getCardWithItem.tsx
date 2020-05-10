import React, { ReactElement } from 'react';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { SpecialCharacters } from 'app/constants/SpecialCharacters';

import { dataToMessage } from 'app/helpers/dataToMessage';
import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';


export type ItemData<T, > = {
  label?: string;
  prefix?: string;
  bold?: boolean;
  value?: T;
};

const BaseCardItem = <T, >(
  {
    label, value, prefix, bold,
  }: ItemData<T>,
): JSX.Element | null => {
  const classes = useCardItemStyle();
  if (isUndefined(value) || isNull(value)) return null;
  return (
    <div className={classes.item}>
      {!isUndefined(label) && (
        <div className={classes.subHeader}>{label}</div>
      )}
      <div className={bold ? classes.bold : ''}>
        {!isUndefined(prefix) && `${prefix}${SpecialCharacters.noBreakSpace}`}
        {dataToMessage(value)}
      </div>
    </div>
  );
};

export type CardItemComponentType<T> = ReactElement<ItemData<T>>;

export const getCardWithItem = <T, >(data: ItemData<T>): CardItemComponentType<T> => (
  <BaseCardItem label={data.label} value={data.value} prefix={data.prefix} bold={data.bold} />
);
