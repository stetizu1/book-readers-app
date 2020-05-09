import React, { FC, ReactElement } from 'react';

import { useCardTextStyle } from 'app/components/common/styles/cardItems/CardTextStyle';


export type TextData = {
  text: string;
  bold?: boolean;
};

const BaseText: FC<TextData> = ({ text, bold }) => {
  const classes = useCardTextStyle();
  return <div className={bold ? classes.bold : classes.text}>{text}</div>;
};

export type TextComponentType = ReactElement<TextData>;

export const getText = (text: string, bold = false): TextComponentType => (
  <BaseText text={text} bold={bold} />
);
