import React, { ComponentType } from 'react';

export const repeat = (Comp: ComponentType, times: number): JSX.Element => {
  const items = [];
  for (let i = 0; i < times; i++) {
    items.push(<Comp key={i} />);
  }
  return <>{items}</>;
};
