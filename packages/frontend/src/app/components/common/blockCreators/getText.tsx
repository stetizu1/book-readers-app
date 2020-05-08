import React, { FC, ReactElement } from 'react';

import { useCardTextStyle } from 'app/components/common/styles/cardItems/CardTextStyle';


export type TextData = {
  text: string;
};

const BaseText: FC<TextData> = ({ text }) => {
  const classes = useCardTextStyle();
  return <div className={classes.text}>{text}</div>;
};

export type TextComponentType = ReactElement<TextData>;

export const getText = (text: string): TextComponentType => (
  <BaseText text={text} />
);
