import React, { FC } from 'react';
import { TextField, Tooltip } from '@material-ui/core';

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
  tooltip?: string;
};

type Props = FormProps<ValueType> & WithRegExpAndMultiline;
type ReadOnlyData = ItemReadonlyData<ValueType>;
type EditableData = ItemEditableData<ValueType> & WithRegExpAndMultiline;

const BaseTextFormItem: FC<Props> = (props) => {
  const classes = useTextFormItemStyle();
  const {
    label, value, required, readOnly, regexp, updateValueFunction,
    multiline = false,
    tooltip,
  } = props;

  const onChange: OnChangeInput | undefined = !isUndefined(updateValueFunction) ? (event): void => {
    updateValueFunction(event.target.value);
  } : undefined;

  const textField = (
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

  if (isUndefined(tooltip)) {
    return textField;
  }

  return (
    <Tooltip title={<span className={classes.tooltip}>{tooltip}</span>}>
      {textField}
    </Tooltip>
  );
};


export const getTextFormItem = getFormItemSkeleton<ValueType, Props, ReadOnlyData, EditableData>(
  BaseTextFormItem,
  '',
);
