import { createSelector } from 'reselect';

import { getData, isStatus } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';

import { LoginState } from './loginReducer';


const getLoginState = (state: AppState): LoginState => state.loginState;


const getLoginStatus = createSelector(getLoginState, (login) => login.loginData);
const getLoggedUserId = createSelector(getLoginStatus, (loginStatus) => getData(loginStatus)?.userId);
const isUserLoggedIn = createSelector(getLoginStatus, (loginStatus) => isStatus.success(loginStatus));

const getRegistrationStatus = createSelector(getLoginState, (login) => login.registrationData);

export const loginSelector = {
  getLoginStatus,
  getLoggedUserId,
  getRegistrationStatus,
  isUserLoggedIn,
};
