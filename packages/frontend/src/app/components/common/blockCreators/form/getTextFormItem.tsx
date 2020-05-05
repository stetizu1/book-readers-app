import React, { FC, ReactElement } from 'react';
import { TextField } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeInput } from 'app/types/EventTypes';

import { composeClasses } from 'app/helpers/style/composeClasses';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormFieldProps,
  isReadOnlyData,
} from 'app/components/common/blockCreators/form/types';
import { useFormItemStyle } from 'app/components/common/styles/FormItemStyle';
import { normalizeValue } from 'app/helpers/normalizeValue';


type RegExp = {
  regexp?: RegExp;
};

export type TextItemEditableData = ItemEditableData<string> & RegExp;
export type TextItemReadonlyData = ItemReadonlyData<string>;


type TextFormProps = FormFieldProps<string> & RegExp;

const BaseTextFormItem: FC<TextFormProps> = (props) => {
  const classes = useFormItemStyle();
  const {
    label, value, required, readOnly, regexp, updateValue,
  } = props;

  const onChange: OnChangeInput | undefined = !isUndefined(updateValue) ? (event): void => {
    updateValue(event.target.value);
  } : undefined;
  const classNames = (readOnly) ? composeClasses(classes.item, classes.readOnly) : classes.item;
  return (
    <div className={classNames}>
      <TextField
        variant="outlined"
        label={label}
        value={value}
        required={required}
        disabled={readOnly}
        inputProps={{ pattern: regexp }}
        onChange={onChange}
      />
    </div>
  );
};

export type TextFormItemType = ReactElement<TextFormProps>;


export const getTextFormItem = (
  data: TextItemEditableData | TextItemReadonlyData,
): TextFormItemType => {
  const { label } = data;
  const value = normalizeValue(data.value, '');
  if (isReadOnlyData(data)) {
    return (
      <BaseTextFormItem readOnly value={value} label={label} required={false} updateValue={undefined} />
    );
  }
  const {
    required = false,
    regexp,
    updateValueFunction,
  } = data;
  return (
    <BaseTextFormItem
      value={value}
      label={label}
      readOnly={false}
      required={required}
      regexp={regexp}
      updateValue={updateValueFunction}
    />
  );
};
