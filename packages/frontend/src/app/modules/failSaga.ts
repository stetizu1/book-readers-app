/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery } from '@redux-saga/core/effects';
import { PayloadAction } from 'typesafe-actions';
import { toast } from 'react-toastify';

import { LoginFailedActionName } from 'app/constants/actionNames/login';
import { UserFailedActionName } from 'app/constants/actionNames/user';
import { LibraryFailedActionName } from 'app/constants/actionNames/library';


const FailActions = {
  ...LoginFailedActionName,
  ...UserFailedActionName,
  ...LibraryFailedActionName,
};
type FailActionsType = typeof FailActions;

type FailType = FailActionsType[keyof FailActionsType];

const failActionsArray = Object.values(FailActions);

function showErrorToastSaga({ payload: errorMessage }: PayloadAction<FailType, string>) {
  toast(errorMessage, {
    type: toast.TYPE.ERROR,
    autoClose: false,
  });
}

export function* failSaga() {
  yield takeEvery(failActionsArray, showErrorToastSaga);
}
