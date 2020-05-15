import React, { FC, ReactElement } from 'react';

import { useCardDescriptionStyle } from './useCardDescriptionStyle';


export type DescriptionData = {
  description: string | JSX.Element;
};

const BaseText: FC<DescriptionData> = ({ description }) => {
  const classes = useCardDescriptionStyle();
  return <div className={classes.description}>{description}</div>;
};

export type DescriptionComponentType = ReactElement<DescriptionData>;

export const getDescription = (description: string | JSX.Element): ReactElement<DescriptionData> => (
  <BaseText description={description} />
);
