import React, { FC, ReactElement } from 'react';

import { HeaderType } from 'app/constants/style/types/HeaderType';

import { usePageHeaderStyle } from './usePageHeaderStyle';


export type HeaderData = {
  header: string;
  headerType: HeaderType;
};

const BaseHeader: FC<HeaderData> = ({ header, headerType }) => {
  const classes = usePageHeaderStyle();
  return (
    <div className={classes.outside}>
      <span className={classes[headerType]}>{header}</span>
    </div>
  );
};

export type PageHeaderComponentType = ReactElement<HeaderData>;

export const getPageHeader = (header: string, headerType = HeaderType.main): PageHeaderComponentType => (
  <BaseHeader header={header} headerType={headerType} />
);
