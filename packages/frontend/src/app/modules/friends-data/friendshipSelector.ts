import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';

import { FriendsDataState } from './friendsDataReducer';


const getFriendsDataState = (state: AppState): FriendsDataState => state.friendsDataState;

const getAllFriendsDataBookDataStatus = createSelector(getFriendsDataState, (friendsDataState) => friendsDataState.bookDataWithReview);
const getAllFriendsDataBookData = createSelector(getAllFriendsDataBookDataStatus, (friendsDataBookDataStatus) => getData(friendsDataBookDataStatus));


export const friendsDataSelector = {
  getAllFriendsDataBookDataStatus,

  getAllFriendsDataBookData,
};
