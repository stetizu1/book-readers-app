import React, { ReactElement } from 'react';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { dataToMessage } from 'app/helpers/dataToMessage';

import { useItemStyle } from './useItemStyle';


export type ItemData<T, > = {
  label?: string;
  value?: T;
};

const BaseItem = <T, >({ label, value }: ItemData<T>): JSX.Element | null => {
  const classes = useItemStyle();

  if (isUndefined.or(isNull)(value)) return null;
  return (
    <div className={classes.item}>
      {!isUndefined(label) && (
        <div className={classes.subHeader}>{label}</div>
      )}
      {dataToMessage(value)}
    </div>
  );
};

export type CardItemComponentType<T> = ReactElement<ItemData<T>>;

export const getItem = <T, >(data: ItemData<T>): CardItemComponentType<T> => (
  <BaseItem label={data.label} value={data.value} />
);
