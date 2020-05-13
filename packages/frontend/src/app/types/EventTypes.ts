import React, { ChangeEvent } from 'react';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';


export type OnClickType = (event: React.MouseEvent) => void;

export type OnChangeWithValue<T> = (event: ChangeEvent<{}>, value: T) => void;

export type OnChangeInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;

export type OnChangeToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;

export type OnChangeSelect = (event: React.ChangeEvent<{name?: string; value: unknown }>, child: React.ReactNode) => void;

export type OnChangeDate = (date: MaterialUiPickersDate, value: string | null | undefined) => void;
