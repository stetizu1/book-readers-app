/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery } from '@redux-saga/core/effects';
import { PayloadAction } from 'typesafe-actions';
import { toast } from 'react-toastify';

import { LoginFailedActionName } from 'app/constants/action-names/login';
import { UserFailedActionName } from 'app/constants/action-names/user';
import { LibraryFailedActionName } from 'app/constants/action-names/library';
import { FriendshipFailedActionName } from '../constants/action-names/friendship';
import { WishlistFailedActionName } from '../constants/action-names/wishlist';
import { BookLoanFailedActionName } from '../constants/action-names/bookLoan';
import { FriendsDataFailedActionName } from '../constants/action-names/friends-data';


export const FailActionName = {
  ...BookLoanFailedActionName,
  ...LoginFailedActionName,
  ...UserFailedActionName,
  ...LibraryFailedActionName,
  ...FriendsDataFailedActionName,
  ...FriendshipFailedActionName,
  ...WishlistFailedActionName,
};
type FailActionsType = typeof FailActionName;

export type FailType = FailActionsType[keyof FailActionsType];

const failActionsArray = Object.values(FailActionName);

function showErrorToastSaga({ payload: errorMessage }: PayloadAction<FailType, string>) {
  toast(errorMessage, {
    type: toast.TYPE.ERROR,
    autoClose: false,
  });
}

export function* failSaga() {
  yield takeEvery(failActionsArray, showErrorToastSaga);
}
