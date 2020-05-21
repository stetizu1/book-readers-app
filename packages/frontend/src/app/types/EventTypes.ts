import {
  ChangeEvent, MouseEvent, FormEvent,
  ReactNode,
} from 'react';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

export type OnSubmitType = (event: FormEvent<HTMLFormElement>) => void;

export type OnClickType = (event: MouseEvent) => void;

export type OnChangeWithValue<T> = (event: ChangeEvent<{}>, value: T) => void;

export type OnChangeInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;

export type OnChangeToggle = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;

export type OnChangeSelect = (event: ChangeEvent<{name?: string; value: unknown }>, child: ReactNode) => void;

export type OnChangeDate = (date: MaterialUiPickersDate, value: string | null | undefined) => void;
