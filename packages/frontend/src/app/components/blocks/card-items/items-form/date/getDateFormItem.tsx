import React, { FC } from 'react';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { DataFormat } from 'book-app-shared/constants/DataFormat';

import { OnChangeDate } from 'app/types/EventTypes';

import { changeIfDefined } from 'app/helpers/form/changeIfDefined';

import {
  ItemEditableData,
  ItemReadonlyData,
  FormProps,
} from 'app/components/blocks/card-items/items-form/types';
import { getFormItemSkeleton } from 'app/components/blocks/card-items/items-form/getFormItemSkeleton';
import { useDateFormItemStyle } from './useDateFormItemStyle';


type ValueType = string;

type Props = FormProps<ValueType>;
type ReadonlyData = ItemReadonlyData<ValueType>;
type EditableData = ItemEditableData<ValueType>;

const BaseDateFormItem: FC<Props> = (props) => {
  const classes = useDateFormItemStyle();
  const {
    label, value, required, readOnly, updateValueFunction,
  } = props;

  const onChange: OnChangeDate = (date, val) => changeIfDefined(updateValueFunction, val || '');

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        className={classes.dateContainer}
        readOnly={readOnly}
        required={required}
        format={DataFormat.date}
        label={label}
        value={value}
        onChange={onChange}
        helperText={undefined}
      />
    </MuiPickersUtilsProvider>
  );
};

export const getDateFormItem = getFormItemSkeleton<ValueType, Props, ReadonlyData, EditableData>(
  BaseDateFormItem,
  '',
);
