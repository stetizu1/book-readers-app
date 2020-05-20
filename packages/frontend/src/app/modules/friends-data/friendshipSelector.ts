import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';
import { getIdMap } from 'app/helpers/getIdMap';

import { FriendsDataState } from './friendsDataReducer';


const getFriendsDataState = (state: AppState): FriendsDataState => state.friendsDataState;

const getAllFriendsDataBookDataStatus = createSelector(getFriendsDataState, (friendsDataState) => friendsDataState.bookDataWithReview);
const getAllFriendsDataBookData = createSelector(getAllFriendsDataBookDataStatus, (friendsDataBookDataStatus) => getData(friendsDataBookDataStatus));
const getAllFriendsDataBookDataMap = createSelector(getAllFriendsDataBookData, (bookData) => getIdMap('id', bookData));

const getAllFriendsBookRequestsStatus = createSelector(getFriendsDataState, (friendsDataState) => friendsDataState.bookRequests);
const getAllFriendsBookRequests = createSelector(getAllFriendsBookRequestsStatus, (friendsDataBookRequestsStatus) => getData(friendsDataBookRequestsStatus));
const getAllFriendsBookRequestsMap = createSelector(getAllFriendsBookRequests, (bookRequest) => getIdMap('bookDataId', bookRequest));

export const friendsDataSelector = {
  getAllFriendsDataBookDataStatus,
  getAllFriendsBookRequestsStatus,

  getAllFriendsDataBookData,
  getAllFriendsDataBookDataMap,

  getAllFriendsBookRequests,
  getAllFriendsBookRequestsMap,
};
