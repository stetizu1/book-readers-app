import React, { FC, ReactElement } from 'react';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { OnChangeDate } from 'app/types/EventTypes';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormFieldProps,
  isReadOnlyData,
} from 'app/components/common/blockCreators/form/types';
import { useFormItemStyle } from 'app/components/common/styles/FormItemStyle';
import { normalizeValue } from 'app/helpers/normalizeValue';


export type DateItemEditableData = ItemEditableData<string>;
export type DateItemReadonlyData = ItemReadonlyData<string>;


type DateFormProps = FormFieldProps<string>;

const BaseDateFormItem: FC<DateFormProps> = (props) => {
  const classes = useFormItemStyle();
  const {
    label, value, required, readOnly, updateValue,
  } = props;

  const onChange: OnChangeDate = (date, val) => {
    if (!isUndefined(updateValue)) {
      updateValue(val || '');
    }
  };
  return (
    <div className={classes.item}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          readOnly={readOnly}
          required={required}
          format="yyyy-MM-dd" // todo const outside
          label={label}
          value={value}
          onChange={onChange}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

export type DateFormItemType = ReactElement<DateFormProps>;

export const getDateFormItem = (
  data: DateItemEditableData | DateItemReadonlyData,
): DateFormItemType => {
  const {
    label,
  } = data;
  const value = normalizeValue(data.value, '');
  if (isReadOnlyData(data)) {
    return (
      <BaseDateFormItem readOnly value={value} label={label} required={false} updateValue={undefined} />
    );
  }
  const {
    required = false,
    updateValueFunction,
  } = data;
  return (
    <BaseDateFormItem
      value={value}
      label={label}
      readOnly={false}
      required={required}
      updateValue={updateValueFunction}
    />
  );
};
