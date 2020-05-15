import React, { ComponentType, ReactElement } from 'react';
import { useFormItemStyle } from 'app/components/blocks/card-items/items-form/useFormItemStyle';
import { normalizeValue } from 'app/helpers/normalizeValue';
import {
  FormProps,
  ItemReadonlyData,
  ItemEditableData,
  isReadOnlyData,
} from 'app/components/blocks/card-items/items-form/types';
import { composeClasses } from 'app/helpers/style/composeClasses';


const BaseFormItem = <T, TProps extends FormProps<T>>(props: TProps & { BaseComponent: ComponentType<TProps> }): JSX.Element => {
  const classes = useFormItemStyle();
  const { BaseComponent, ...rest } = props;
  const restTyped = rest as unknown as TProps;

  const itemClasses = props.readOnly ? composeClasses(classes.item, classes.readOnly) : classes.item;

  return (
    <div className={itemClasses}>
      <BaseComponent {...restTyped} />
    </div>
  );
};


type FormItemType<T, TProps extends FormProps<T>> = ReactElement<TProps>;


export const getFormItemSkeleton = (
  <T, TProps extends FormProps<T>, TReadOnly extends ItemReadonlyData<T>, TEditable extends ItemEditableData<T>>
  (BaseComponent: ComponentType<TProps>, defaultValue: T, defaultRequired = false) => (
    (data: TEditable | TReadOnly): FormItemType<T, TProps> => {
      const normalizedValue = normalizeValue(data.value, defaultValue);

      const getReadOnlyProps = (readData: TReadOnly): TProps => {
        const {
          readOnly, value, label, ...rest
        } = readData;
        const baseProps: FormProps<T> = {
          readOnly: true,
          label,
          value: normalizedValue,
        };
        return {
          ...baseProps,
          ...rest,
        } as unknown as TProps;
      };

      const getEditableProps = (editData: TEditable): TProps => {
        const {
          value,
          label,
          required = defaultRequired,
          updateValueFunction,
          ...rest
        } = editData;
        const baseProps: FormProps<T> = {
          readOnly: false,
          label,
          value: normalizedValue,
          required,
          updateValueFunction,
        };
        return {
          ...baseProps,
          ...rest,
        } as unknown as TProps;
      };

      const props = (isReadOnlyData<T, TReadOnly, TEditable>(data)) ? getReadOnlyProps(data) : getEditableProps(data);
      return (
        <BaseFormItem<T, TProps>
          BaseComponent={BaseComponent}
          {...props}
        />
      );
    }
  )
);
