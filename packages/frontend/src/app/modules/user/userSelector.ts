import { createSelector } from 'reselect';

import { getData } from '../../constants/Status';
import { AppState } from '../rootReducer';

import { UserState } from './userReducer';


const getUserState = (state: AppState): UserState => state.userState;

const getCurrentUserStatus = createSelector(getUserState, (user) => user.currentUser);
const getCurrentUser = createSelector(getCurrentUserStatus, (currentUser) => getData(currentUser));
const getCurrentUserEmail = createSelector(getCurrentUser, (currentUser) => currentUser?.email);

const getPublicUsersStatus = createSelector(getUserState, (user) => user.publicUsers);
const getPublicUsers = createSelector(getPublicUsersStatus, (publicUsers) => getData(publicUsers));

export const userSelector = {
  getCurrentUserStatus,
  getCurrentUser,
  getCurrentUserEmail,

  getPublicUsersStatus,
  getPublicUsers,
};
