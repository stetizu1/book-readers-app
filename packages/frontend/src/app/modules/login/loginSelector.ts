import { createSelector } from 'reselect';

import { getData, getErrorMessage, isStatus } from '../../constants/Status';
import { AppState } from '../rootReducer';

import { LoginState } from './loginReducer';


const getLoginState = (state: AppState): LoginState => state.loginState;

const getLoggedUserId = createSelector(getLoginState, (login) => getData(login.loginData)?.userId);

const getLoginError = createSelector(getLoginState, (login) => getErrorMessage(login.loginData));

const isLoading = createSelector(getLoginState, (login) => isStatus.loading(login.loginData));

export const loginSelector = {
  getLoginState,
  getLoggedUserId,
  getLoginError,
  isLoading,
};
