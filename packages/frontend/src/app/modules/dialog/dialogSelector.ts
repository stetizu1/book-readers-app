import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';
import { DialogState } from './dialogReducer';

const getDialogState = (state: AppState): DialogState => state.dialogState;
const getIsOpen = createSelector(getDialogState, (dialogState) => dialogState.isOpen);

export const dialogSelector = {
  getIsOpen,
};
