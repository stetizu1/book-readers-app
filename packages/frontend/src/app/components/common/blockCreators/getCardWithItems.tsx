import React, { ReactElement } from 'react';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { dataToMessage } from 'app/helpers/dataToMessage';
import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';


export type ItemDataWithArray<T extends {}, K extends keyof T> = {
  label?: string;
  bold?: boolean;
  values: T[];
  structureKey: K;
};

const BaseCardWithItems = <T extends {}, K extends keyof T>(
  {
    label, values, bold, structureKey,
  }: ItemDataWithArray<T, K>,
): JSX.Element => {
  const classes = useCardItemStyle();

  return (
    <div className={classes.item}>
      {!isUndefined(label) && (
        <div className={classes.subHeader}>{label}</div>
      )}
      {values.map((value, index) => (
        <div key={`${label}-${index}`} className={bold ? classes.bold : ''}>
          {dataToMessage(value[structureKey])}
        </div>
      ))}
    </div>
  );
};

export type CardItemComponentType<T extends {}, K extends keyof T> = ReactElement<ItemDataWithArray<T, K>>;

export const getCardWithItems = <T extends {}, K extends keyof T>(data: ItemDataWithArray<T, K>): CardItemComponentType<T, K> => (
  <BaseCardWithItems label={data.label} values={data.values} bold={data.bold} structureKey={data.structureKey} />
);
