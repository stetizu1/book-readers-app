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
import { useTextFormItemStyle } from './useTextFormItemStyle';


type ValueType = string;

type WithRegExpAndMultiline = {
  regexp?: string;
  multiline?: boolean;
};

type Props = FormProps<ValueType> & WithRegExpAndMultiline;
type ReadOnlyData = ItemReadonlyData<ValueType>;
type EditableData = ItemEditableData<ValueType> & WithRegExpAndMultiline;

const BaseTextFormItem: FC<Props> = (props) => {
  const classes = useTextFormItemStyle();
  const {
    label, value, required, readOnly, regexp, updateValueFunction,
    multiline = false,
  } = props;

  const onChange: OnChangeInput | undefined = !isUndefined(updateValueFunction) ? (event): void => {
    updateValueFunction(event.target.value);
  } : undefined;
  return (
    <TextField
      className={classes.item}
      variant="outlined"
      label={label}
      value={value}
      multiline={multiline}
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
