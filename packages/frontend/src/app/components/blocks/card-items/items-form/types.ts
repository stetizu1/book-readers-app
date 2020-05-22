import { UpdateValueFunction } from 'app/types/UpdateValueFunction';

type Data<T> = {
  label: string | null;
  value: T;
};

type ReadOnlyData<TBool extends boolean = boolean> = {
  readOnly: TBool;
};

type EditableData<T> = {
  updateValueFunction?: UpdateValueFunction<T>;
  required?: boolean;
};

export type FormProps<T> = Data<T> & ReadOnlyData & EditableData<T>;

export type ItemData<T> = Data<T | null | undefined>;
export type ItemReadonlyData<T> = ItemData<T> & ReadOnlyData<true>;
export type ItemEditableData<T> = ItemData<T> & EditableData<T>;

export const isReadOnlyData = <T, TReadOnly extends ItemReadonlyData<T>, TEditable extends ItemEditableData<T>>(
  data: TReadOnly | TEditable,
): data is TReadOnly => 'readOnly' in data;
