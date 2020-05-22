import React, { ReactElement } from 'react';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { dataToMessage } from 'app/helpers/dataToMessage';

import { useItemsStyle } from './useItemsStyle';


export type ItemDataWithArray<T extends {}, K extends keyof T> = {
  label?: string;
  values: T[];
  structureKey: K;
};

const BaseCardWithItems = <T extends {}, K extends keyof T>(
  {
    label, values, structureKey,
  }: ItemDataWithArray<T, K>,
): JSX.Element => {
  const classes = useItemsStyle();

  return (
    <div className={classes.item}>
      {!isUndefined(label) && (
        <div className={classes.subHeader}>{label}</div>
      )}
      {values.map((value) => (
        <div key={`${label}-${value[structureKey]}`}>
          {dataToMessage(value[structureKey])}
        </div>
      ))}
    </div>
  );
};

export type CardItemComponentType<T extends {}, K extends keyof T> = ReactElement<ItemDataWithArray<T, K>>;

export const getItems = <T extends {}, K extends keyof T>(data: ItemDataWithArray<T, K>): CardItemComponentType<T, K> => (
  <BaseCardWithItems label={data.label} values={data.values} structureKey={data.structureKey} />
);
