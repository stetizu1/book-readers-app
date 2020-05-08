import React, { ReactElement } from 'react';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { SpecialCharacters } from 'app/constants/SpecialCharacters';

import { dataToMessage } from 'app/helpers/dataToMessage';
import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';


export type ItemData<T extends {}, K extends keyof T> = {
  label?: string;
  prefix?: string;
  bold?: boolean;
  value: T[K];
};

const BaseCardItem = <T extends {}, K extends keyof T>({
  label, value, prefix, bold,
}: ItemData<T, K>): JSX.Element => {
  const classes = useCardItemStyle();
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

export type CardItemComponentType<T extends {}, K extends keyof T> = ReactElement<ItemData<T, K>>;

export const getCardItem = <T extends {}, K extends keyof T>(data: ItemData<T, K>): CardItemComponentType<T, K> => (
  <BaseCardItem label={data.label} value={data.value} prefix={data.prefix} bold={data.bold} />
);
