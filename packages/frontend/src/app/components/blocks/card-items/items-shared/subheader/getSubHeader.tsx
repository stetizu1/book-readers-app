import React, { FC, ReactElement } from 'react';

import { useCardSubHeaderStyle } from 'app/components/blocks/card-items/items-shared/subheader/useCardSubHeaderStyle';


export type TextData = {
  text: string;
};

const BaseSubHeader: FC<TextData> = ({ text }) => {
  const classes = useCardSubHeaderStyle();
  return (
    <div className={classes.subheader}>
      {text}
      <hr className={classes.subLine} />
    </div>
  );
};

export const getSubHeader = (text: string): ReactElement<TextData> => (
  <BaseSubHeader text={text} />
);
