import { ActionType, createAction } from 'typesafe-actions';
import { DialogActionNames } from '../../constants/actionNames/dialog';

export const dialogAction = {
  setOpen: createAction(DialogActionNames.SET_OPEN)<boolean>(),
};

export type DialogAction = ActionType<typeof dialogAction>;
