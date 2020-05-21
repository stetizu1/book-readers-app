import React from 'react';

import { Card, CardData } from '../../card-components/card/Card';
import { EmptyComponent } from '../../empty/EmptyComponent';


export interface CardsData<T> {
  data: T[];
  getCardData: (data: T) => CardData;
  getKey: (data: T) => string;
}

export const Cards = <T extends {}>({ data, getCardData, getKey }: CardsData<T>): JSX.Element => {
  if (!data.length) {
    return <EmptyComponent />;
  }
  return (
    <>
      {data.map((value) => (
        <Card data={getCardData(value)} key={getKey(value)} />
      ))}
    </>
  );
};
