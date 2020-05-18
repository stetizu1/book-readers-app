import { all, fork } from '@redux-saga/core/effects';

import { failSaga } from './failSaga';
import { successSaga } from './successSaga';
import { userSaga } from './user/userSaga';
import { loginSaga } from './login/loginSaga';
import { librarySaga } from './library/librarySaga';
import { friendshipSaga } from './friendship/friendshipSaga';
import { refreshSaga } from './refreshSaga';
import { wishlistSaga } from './wishlist/wishlistSaga';
import { bookLoanSaga } from './book-loan/bookLoanSaga';


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* rootSaga() {
  yield all([
    fork(failSaga),
    fork(successSaga),
    fork(refreshSaga),

    fork(bookLoanSaga),
    fork(friendshipSaga),
    fork(librarySaga),
    fork(userSaga),
    fork(wishlistSaga),
  ]);
  yield fork(loginSaga); // Should come last as it initiates login from localStorage
}
