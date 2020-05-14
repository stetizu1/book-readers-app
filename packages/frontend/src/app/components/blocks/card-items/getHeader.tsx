import React, { FC, ReactElement } from 'react';

import { useCardHeaderStyle } from 'app/components/blocks/styles/cardItems/CardHeaderStyle';


export type HeaderData = {
  header: string;
};

const BaseHeader: FC<HeaderData> = ({ header }) => {
  const classes = useCardHeaderStyle();
  return <div className={classes.header}>{header}</div>;
};

export type HeaderComponentType = ReactElement<HeaderData>;

export const getHeader = (header: string): HeaderComponentType => (
  <BaseHeader header={header} />
);
