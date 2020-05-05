import React, { FC, ReactElement } from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeToggle } from 'app/types/EventTypes';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormFieldProps,
  isReadOnlyData,
} from 'app/components/common/blockCreators/form/types';
import { useFormItemStyle } from 'app/components/common/styles/FormItemStyle';
import { normalizeValue } from 'app/helpers/normalizeValue';


export interface BooleanItemEditableData extends ItemEditableData<boolean> {
  required?: true;
}

export type BooleanItemReadonlyData = ItemReadonlyData<boolean>;


type BooleanFormProps = FormFieldProps<boolean>;

const BaseBooleanFormItem: FC<BooleanFormProps> = (props) => {
  const classes = useFormItemStyle();
  const {
    label, value, required, readOnly, updateValue,
  } = props;

  const onChange: OnChangeToggle | undefined = !isUndefined(updateValue) ? (event): void => {
    updateValue(event.target.checked);
  } : undefined;
  return (
    <div className={classes.item}>
      <FormControlLabel
        control={<Switch disabled={readOnly} color="primary" className={classes.switchBase} required={required} checked={value} onChange={onChange} />}
        label={label}
      />
    </div>
  );
};

export type BooleanFormItemType = ReactElement<BooleanFormProps>;

export const getBooleanFormItem = (
  data: BooleanItemEditableData | BooleanItemReadonlyData,
): BooleanFormItemType => {
  const {
    label,
  } = data;
  const value = normalizeValue(data.value, false);
  if (isReadOnlyData(data)) {
    return (
      <BaseBooleanFormItem readOnly value={value} label={label} required={false} updateValue={undefined} />
    );
  }
  const {
    required = true,
    updateValueFunction,
  } = data;
  return (
    <BaseBooleanFormItem
      value={value}
      label={label}
      readOnly={false}
      required={required}
      updateValue={updateValueFunction}
    />
  );
};
