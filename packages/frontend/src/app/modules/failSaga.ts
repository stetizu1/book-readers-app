/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery } from '@redux-saga/core/effects';
import { PayloadAction } from 'typesafe-actions';
import { toast } from 'react-toastify';

import { LoginFailedActionName } from 'app/constants/action-names/login';
import { UserFailedActionName } from 'app/constants/action-names/user';
import { LibraryFailedActionName } from 'app/constants/action-names/library';
import { FriendshipFailedActionName } from '../constants/action-names/friendship';
import { WishlistFailedActionName } from '../constants/action-names/wishlist';


const FailActions = {
  ...LoginFailedActionName,
  ...UserFailedActionName,
  ...LibraryFailedActionName,
  ...FriendshipFailedActionName,
  ...WishlistFailedActionName,
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
