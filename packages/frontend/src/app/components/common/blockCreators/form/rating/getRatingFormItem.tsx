import React, { FC } from 'react';
import { Rating } from '@material-ui/lab';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeWithValue } from 'app/types/EventTypes';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,
} from 'app/components/common/blockCreators/form/types';
import { getFormItemSkeleton } from 'app/components/common/blockCreators/form/getFormItemSkeleton';


type ValueType = number | null;

type Props = FormProps<ValueType>;
type EditableData = ItemEditableData<ValueType>;
type ReadOnlyData = ItemReadonlyData<ValueType>;

const BaseRatingFormItem: FC<Props> = (props) => {
  const {
    label, value, required, readOnly, updateValueFunction,
  } = props;

  const defaultValue = (required) ? 3 : undefined;

  const onChange: OnChangeWithValue<number | null> = (date, val) => {
    if (!isUndefined(updateValueFunction)) {
      const newValue = (!required || isNull(val)) ? val : 3;
      updateValueFunction(newValue);
    }
  };
  return (
    <>
      <div>{label}</div>
      <Rating
        name={!isNull(label) ? label : undefined}
        defaultValue={defaultValue}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
      />
    </>
  );
};

export const getRatingFormItem = getFormItemSkeleton<ValueType, Props, ReadOnlyData, EditableData>(
  BaseRatingFormItem,
  null,
);
