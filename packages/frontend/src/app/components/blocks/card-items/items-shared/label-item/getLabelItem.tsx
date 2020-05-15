import React, { FC, ReactElement } from 'react';

import { Label } from 'book-app-shared/types/Label';

import { useLabelItemStyle } from './useLabelItemStyle';


export type LabelsData = {
  label: Label;
};

const BaseLabelItem: FC<LabelsData> = ({ label }) => {
  const classes = useLabelItemStyle();
  return (
    <div className={classes.label}>{label.name}</div>
  );
};

export const getLabelItem = (label: Label): ReactElement<LabelsData> => (
  <BaseLabelItem label={label} key={label.id} />
);
