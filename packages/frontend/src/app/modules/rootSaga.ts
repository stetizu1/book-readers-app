import { all, fork } from '@redux-saga/core/effects';

import { failSaga } from './failSaga';
import { successSaga } from './successSaga';
import { userSaga } from './user/userSaga';
import { loginSaga } from './login/loginSaga';
import { librarySaga } from './library/librarySaga';


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* rootSaga() {
  yield all([
    fork(failSaga),
    fork(successSaga),

    fork(userSaga),
    fork(librarySaga),
  ]);
  yield fork(loginSaga); // Should come last as it initiates login from localStorage
}
