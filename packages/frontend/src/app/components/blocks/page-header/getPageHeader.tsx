import React, { FC, ReactElement } from 'react';

import { usePageHeaderStyle } from './usePageHeaderStyle';


export type HeaderData = {
  header: string;
};

const BaseHeader: FC<HeaderData> = ({ header }) => {
  const classes = usePageHeaderStyle();
  return (
    <div className={classes.outside}>
      <span className={classes.text}>{header}</span>
    </div>
  );
};

export type HeaderComponentType = ReactElement<HeaderData>;

export const getPageHeader = (header: string): HeaderComponentType => (
  <BaseHeader header={header} />
);
