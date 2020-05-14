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
} from 'app/components/common/blockCreators/form/types';
import { getFormItemSkeleton } from 'app/components/common/blockCreators/form/getFormItemSkeleton';


type ValueType = string;

type Props = FormProps<ValueType>;
type ReadonlyData = ItemReadonlyData<ValueType>;
type EditableData = ItemEditableData<ValueType>;

const BaseDateFormItem: FC<Props> = (props) => {
  const {
    label, value, required, readOnly, updateValueFunction,
  } = props;

  const onChange: OnChangeDate = (date, val) => changeIfDefined(updateValueFunction, val || '');

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        readOnly={readOnly}
        required={required}
        format={DataFormat.date}
        label={label}
        value={value}
        onChange={onChange}
      />
    </MuiPickersUtilsProvider>
  );
};

export const getDateFormItem = getFormItemSkeleton<ValueType, Props, ReadonlyData, EditableData>(
  BaseDateFormItem,
  '',
);
