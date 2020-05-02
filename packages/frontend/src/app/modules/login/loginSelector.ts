import { createSelector } from 'reselect';

import { getData, isStatus } from '../../constants/Status';
import { AppState } from '../rootReducer';

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
