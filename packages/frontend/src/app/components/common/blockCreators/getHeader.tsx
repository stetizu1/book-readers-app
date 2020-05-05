import React, { FC, ReactElement } from 'react';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { useCardHeaderStyle } from 'app/components/common/styles/CardHeaderStyle';


export type HeaderData = {
  header: string;
};

const BaseHeader: FC<HeaderData> = ({ header }) => {
  const classes = useCardHeaderStyle();
  return <div className={classes.header}>{header}</div>;
};

export type HeaderType = ReactElement<HeaderData>;

export const getHeader = (
  header: string | undefined,
): HeaderType | null => {
  if (isUndefined(header)) return null;
  return (
    <BaseHeader header={header} />
  );
};
