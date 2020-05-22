import React, { FC, ReactElement, Fragment } from 'react';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { PositionType } from 'app/constants/style/types/PositionType';

import { useItemsGroupStyle } from './useItemsGroupStyle';


interface ItemsProps {
  items?: JSX.Element[];
  positionType: PositionType;
}

const BaseItemsGroup: FC<ItemsProps> = (props) => {
  const classes = useItemsGroupStyle();
  const {
    positionType,
    items = [],
  } = props;

  if (isUndefined(items)) return null;
  return (
    <div className={classes[positionType]}>
      {items.map((data, index) => (
        <Fragment key={`${data.props.label}-${index}`}>
          {data}
        </Fragment>
      ))}
    </div>
  );
};

export const getItemsGroup = (items: JSX.Element[], positionType = PositionType.topLeft): ReactElement<ItemsProps> => (
  <BaseItemsGroup items={items} positionType={positionType} />
);
