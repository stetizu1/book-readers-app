import { all, fork } from '@redux-saga/core/effects';
import { loginSaga } from './login/loginSaga';
import { userSaga } from './user/userSaga';
import { failSaga } from './failSaga';


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* rootSaga() {
  yield all([
    fork(failSaga),

    fork(userSaga),
  ]);
  yield fork(loginSaga); // Should come last as it initiates login from localStorage
}
