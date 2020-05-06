import React, { FC, ReactElement } from 'react';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { useCardSubHeaderStyle } from 'app/components/common/styles/cardItems/CardSubHeaderStyle';


export type SubHeaderData = {
  subHeader: string;
};

const BaseSubHeader: FC<SubHeaderData> = ({ subHeader }) => {
  const classes = useCardSubHeaderStyle();
  return <div className={classes.header}>{subHeader}</div>;
};

export type SubHeaderType = ReactElement<SubHeaderData>;

export const getSubHeader = (
  subHeader: string | undefined,
): SubHeaderType | null => {
  if (isUndefined(subHeader)) return null;
  return (
    <BaseSubHeader subHeader={subHeader} />
  );
};
