import { ActionType, createAction } from 'typesafe-actions';

import { DialogActionNames } from 'app/constants/action-names/dialog';


export const dialogAction = {
  setState: createAction(DialogActionNames.SET_OPEN)<boolean>(),
};

export type DialogAction = ActionType<typeof dialogAction>;
