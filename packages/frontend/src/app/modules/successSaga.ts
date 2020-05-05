/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery } from '@redux-saga/core/effects';
import { PayloadAction } from 'typesafe-actions';
import { toast } from 'react-toastify';

import { UserSucceededWithMessage } from 'app/constants/actionNames/user';
import { WithSuccessMessage } from 'app/helpers/action/wrapPayload';


const SuccessActions = {
  ...UserSucceededWithMessage,
};
type SuccessActionsType = typeof SuccessActions;

type SuccessType = SuccessActionsType[keyof SuccessActionsType];

const successActionsArray = Object.values(SuccessActions);

function showSuccessToastSaga({ payload }: PayloadAction<SuccessType, WithSuccessMessage>) {
  toast(payload.successMessage, {
    type: toast.TYPE.SUCCESS,
  });
}

export function* successSaga() {
  yield takeEvery(successActionsArray, showSuccessToastSaga);
}
