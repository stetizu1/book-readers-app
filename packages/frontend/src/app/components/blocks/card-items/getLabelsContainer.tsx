import React, { FC, ReactElement } from 'react';

import { useCardItemStyle } from 'app/components/blocks/styles/cardItems/CardItemStyle';
import { Label } from 'book-app-shared/types/Label';
import { composeClasses } from 'app/helpers/style/composeClasses';
import { getLabelItem } from 'app/components/blocks/card-items/items-inner/label-item/getLabelItem';


export type LabelsData = {
  labels: Label[];
};

const BaseLabelsContainer: FC<LabelsData> = ({ labels }) => {
  const classes = useCardItemStyle();
  return (
    <div className={composeClasses(classes.item, classes.itemContainer)}>
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
