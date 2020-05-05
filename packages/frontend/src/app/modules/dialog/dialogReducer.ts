import { Reducer } from 'redux';

import { DialogActionNames } from 'app/constants/actionNames/dialog';

import { DialogAction } from './dialogAction';


export interface DialogState {
  isOpen: boolean;
}

const initialState: DialogState = {
  isOpen: false,
};

const reducer = {
  setOpen: (state: DialogState, isOpen: boolean): DialogState => ({
    ...state,
    isOpen,
  }),
};

export const dialogReducer: Reducer<DialogState, DialogAction> = (state = initialState, action) => {
  switch (action.type) {
    case DialogActionNames.SET_OPEN:
      return reducer.setOpen(state, action.payload);
    default:
      return state;
  }
};
