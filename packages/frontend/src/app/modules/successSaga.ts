/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery } from '@redux-saga/core/effects';
import { PayloadAction } from 'typesafe-actions';
import { toast } from 'react-toastify';

import { UserSucceededWithMessageActionName } from 'app/constants/action-names/user';
import { WithSuccessMessage } from 'app/helpers/action/wrapPayload';
import { LoginSucceedWithMessageActionName } from 'app/constants/action-names/login';
import { LibrarySucceededWithMessageActionName } from 'app/constants/action-names/library';
import { FriendshipSucceededWithMessageActionName } from 'app/constants/action-names/friendship';
import { WishlistSucceededWithMessageActionName } from 'app/constants/action-names/wishlist';
import { BookLoanSucceededWithMessageActionName } from 'app/constants/action-names/bookLoan';


const SuccessActions = {
  ...BookLoanSucceededWithMessageActionName,
  ...UserSucceededWithMessageActionName,
  ...LoginSucceedWithMessageActionName,
  ...LibrarySucceededWithMessageActionName,
  ...FriendshipSucceededWithMessageActionName,
  ...WishlistSucceededWithMessageActionName,
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
