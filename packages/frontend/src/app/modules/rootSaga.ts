import { all, fork } from '@redux-saga/core/effects';
import { loginSaga } from './login/loginSaga';
import { userSaga } from './user/userSaga';


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(loginSaga),
  ]);
}
