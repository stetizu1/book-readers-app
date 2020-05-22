import React from 'react';

import { EmptyComponent } from 'app/components/blocks/empty/EmptyComponent';
import { GridCard, GridCardData } from 'app/components/blocks/card-components/grid-card/GridCard';
import { ButtonComponentType } from 'app/components/blocks/card-items/button/getButton';


export interface GridCardsData<T> {
  data: T[];
  getGridCardData: (data: T) => GridCardData;
  getKey: (data: T) => string;
  description?: string;
  button?: ButtonComponentType;
}

export const GridCards = <T extends {}>(props: GridCardsData<T>): JSX.Element => {
  const {
    data, getGridCardData, description, button, getKey,
  } = props;

  if (!data.length) {
    return <EmptyComponent message={description} button={button} />;
  }

  return (
    <>
      {data.map((value) => (
        <GridCard data={getGridCardData(value)} key={getKey(value)} />
      ))}
    </>
  );
};
