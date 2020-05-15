import React, { FC, ReactElement } from 'react';

import { Label } from 'book-app-shared/types/Label';
import { getLabelItem } from 'app/components/blocks/card-items/items-shared/label-item/getLabelItem';

import { useLabelsContainerStyle } from './useLabelsContainerStyle';


export type LabelsData = {
  labels: Label[];
};

const BaseLabelsContainer: FC<LabelsData> = ({ labels }) => {
  const classes = useLabelsContainerStyle();
  return (
    <div className={classes.container}>
      {labels.map(
        (label) => (
          getLabelItem(label)
        ),
      )}
    </div>
  );
};

export type LabelsComponentType = ReactElement<LabelsData>;

export const getLabelsContainer = (labels: Label[]): LabelsComponentType => (
  <BaseLabelsContainer labels={labels} />
);
