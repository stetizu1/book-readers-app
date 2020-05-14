import React, { FC } from 'react';
import { TextField } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeInput } from 'app/types/EventTypes';


import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,
} from 'app/components/blocks/card-items/items-form/types';
import { getFormItemSkeleton } from 'app/components/blocks/card-items/items-form/getFormItemSkeleton';


type ValueType = string;

type WithRegExp = {
  regexp?: RegExp;
};

type Props = FormProps<ValueType> & WithRegExp;
type ReadOnlyData = ItemReadonlyData<ValueType>;
type EditableData = ItemEditableData<ValueType> & WithRegExp;

const BaseTextFormItem: FC<Props> = (props) => {
  const {
    label, value, required, readOnly, regexp, updateValueFunction,
  } = props;

  const onChange: OnChangeInput | undefined = !isUndefined(updateValueFunction) ? (event): void => {
    updateValueFunction(event.target.value);
  } : undefined;
  return (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      required={required}
      disabled={readOnly}
      inputProps={{ pattern: regexp }}
      onChange={onChange}
    />
  );
};


export const getTextFormItem = getFormItemSkeleton<ValueType, Props, ReadOnlyData, EditableData>(
  BaseTextFormItem,
  '',
);
