import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';

import { FriendsDataState } from './friendsDataReducer';
import { getIdMap } from '../../helpers/getIdMap';


const getFriendsDataState = (state: AppState): FriendsDataState => state.friendsDataState;

const getAllFriendsDataBookDataStatus = createSelector(getFriendsDataState, (friendsDataState) => friendsDataState.bookDataWithReview);
const getAllFriendsDataBookData = createSelector(getAllFriendsDataBookDataStatus, (friendsDataBookDataStatus) => getData(friendsDataBookDataStatus));
const getAllFriendsDataBookDataMap = createSelector(getAllFriendsDataBookData, (bookData) => getIdMap('id', bookData));

export const friendsDataSelector = {
  getAllFriendsDataBookDataStatus,

  getAllFriendsDataBookData,
  getAllFriendsDataBookDataMap,
};
