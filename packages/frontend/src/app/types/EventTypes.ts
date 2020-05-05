import React, { ChangeEvent } from 'react';


export type OnClickType = (event: React.MouseEvent) => void;
export type OnChange = (event: ChangeEvent<{}>, value: string) => void;
