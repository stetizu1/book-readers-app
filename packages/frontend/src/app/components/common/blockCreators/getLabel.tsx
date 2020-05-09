import React, { FC, ReactElement } from 'react';

import { useCardItemStyle } from 'app/components/common/styles/cardItems/CardItemStyle';
import { Label } from 'book-app-shared/types/Label';
import { composeClasses } from 'app/helpers/style/composeClasses';


export type LabelsData = {
  labels: Label[];
};

const BaseLabel: FC<LabelsData> = ({ labels }) => {
  const classes = useCardItemStyle();
  return (
    <div className={composeClasses(classes.item, classes.shifted)}>
      {labels.map(
        (label) => (
          <span className={classes.label} key={label.id}>{label.name}</span>
        ),
      )}
    </div>
  );
};

export type LabelsComponentType = ReactElement<LabelsData>;

export const getLabels = (labels: Label[]): LabelsComponentType => (
  <BaseLabel labels={labels} />
);
