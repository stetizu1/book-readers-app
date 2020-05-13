import { Format } from 'book-app-shared/types/enums/Format';

import { UpdateValueFunction } from 'app/types/UpdateValueFunction';
import { TextFormItemType } from 'app/components/common/blockCreators/form/getTextFormItem';
import { BooleanFormItemType } from 'app/components/common/blockCreators/form/getBooleanFormItem';
import { SelectFormItemType } from 'app/components/common/blockCreators/form/getSelectFormItem';
import { MultiSelectFormItemType } from 'app/components/common/blockCreators/form/getMultiSelectFormItem';
import { DateFormItemType } from 'app/components/common/blockCreators/form/getDateFormItem';
import { RatingFormItemType } from 'app/components/common/blockCreators/form/getRatingFormItem';

export interface ItemData<T> {
  label?: string;
  value?: T | null;
}

export interface ItemReadonlyData<T> extends ItemData<T> {
  readOnly: true;
}

export interface ItemEditableData<T> extends ItemData<T> {
  required?: boolean;
  updateValueFunction: UpdateValueFunction<T>;
}

export interface FormFieldProps<T> {
  label: string | undefined;
  value: T;
  readOnly: boolean;
  required: boolean;
  updateValue: UpdateValueFunction<T> | undefined;
}


export const isReadOnlyData = <T, >(
  data: ItemReadonlyData<T> | ItemEditableData<T>,
): data is ItemReadonlyData<T> => 'readOnly' in data;

/**
 * Types to render
 */
export type FormItemType = (
  TextFormItemType
  | BooleanFormItemType
  | SelectFormItemType<string> | SelectFormItemType<Format> | SelectFormItemType<number>
  | MultiSelectFormItemType
  | DateFormItemType
  | RatingFormItemType
);
