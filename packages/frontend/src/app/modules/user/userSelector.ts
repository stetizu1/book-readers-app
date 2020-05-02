import { createSelector } from 'reselect';

import { getData, getErrorMessage, isStatus } from '../../constants/Status';
import { AppState } from '../rootReducer';

import { UserState } from './userReducer';


const getUserState = (state: AppState): UserState => state.userState;

const getCurrentUser = createSelector(getUserState, (login) => getData(login.currentUser));
const isCurrentUserLoading = createSelector(getUserState, (login) => isStatus.loading(login.currentUser));
const getCurrentUserError = createSelector(getUserState, (login) => getErrorMessage(login.currentUser));

const getPublicUsers = createSelector(getUserState, (login) => getData(login.publicProfiles));
const isPublicUsersLoading = createSelector(getUserState, (login) => isStatus.loading(login.publicProfiles));
const getPublicUsersError = createSelector(getUserState, (login) => getErrorMessage(login.publicProfiles));

export const userSelector = {
  getCurrentUser,
  isCurrentUserLoading,
  getCurrentUserError,

  getPublicUsers,
  isPublicUsersLoading,
  getPublicUsersError,
};
