import React, { ChangeEvent } from 'react';


export type OnClickType = (event: React.MouseEvent) => void;

export type OnChange = (event: ChangeEvent<{}>, value: string) => void;

export type OnChangeInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;

export type OnChangeToggle = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
