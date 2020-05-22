import { createSelector } from 'reselect';

import { getData, isStatus } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';

import { LoginState } from './loginReducer';


const getLoginState = (state: AppState): LoginState => state.loginState;

const getGoogleData = createSelector(getLoginState, (loginState) => loginState.googleData);

const getLoginStatus = createSelector(getLoginState, (loginState) => loginState.loginData);
const getLoggedUserId = createSelector(getLoginStatus, (loginStatus) => getData(loginStatus)?.userId);
const isUserLoggedIn = createSelector(getLoginStatus, (loginStatus) => isStatus.success(loginStatus));

const getRegistrationStatus = createSelector(getLoginState, (loginState) => loginState.registrationData);

const getRegistrationCheckLoading = createSelector(getLoginState, (loginState) => loginState.registrationCheckLoading);

export const loginSelector = {
  getLoginStatus,
  getRegistrationStatus,

  getRegistrationCheckLoading,
  getGoogleData,
  getLoggedUserId,
  isUserLoggedIn,
};
