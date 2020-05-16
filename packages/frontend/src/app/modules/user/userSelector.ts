import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';
import { getIdMap } from 'app/helpers/getIdMap';

import { UserState } from './userReducer';


const getUserState = (state: AppState): UserState => state.userState;

const getCurrentUserStatus = createSelector(getUserState, (user) => user.currentUser);
const getCurrentUser = createSelector(getCurrentUserStatus, (currentUser) => getData(currentUser));
const getCurrentUserEmail = createSelector(getCurrentUser, (currentUser) => currentUser?.email);
const getCurrentUserId = createSelector(getCurrentUser, (currentUser) => currentUser?.id);

const getUsersStatus = createSelector(getUserState, (user) => user.users);
const getUsers = createSelector(getUsersStatus, (publicUsers) => getData(publicUsers));
const getUsersMap = createSelector(getUsers, (users) => getIdMap('id', users));

export const userSelector = {
  getCurrentUserStatus,
  getCurrentUser,
  getCurrentUserId,
  getCurrentUserEmail,

  getUsersStatus,
  getUsers,
  getUsersMap,
};
