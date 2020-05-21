import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';
import { getIdMap } from 'app/helpers/getIdMap';

import { FriendsDataState } from './friendsDataReducer';
import { sortByInnerNumber } from '../../helpers/sort/sortByInnerNumber';


const getFriendsDataState = (state: AppState): FriendsDataState => state.friendsDataState;

const getAllFriendsDataBookDataStatus = createSelector(getFriendsDataState, (friendsDataState) => friendsDataState.bookDataWithReview);
const getAllFriendsDataBookData = createSelector(getAllFriendsDataBookDataStatus, (friendsDataBookDataStatus) => getData(friendsDataBookDataStatus));
const getAllFriendsDataBookDataMap = createSelector(getAllFriendsDataBookData, (bookData) => getIdMap('id', bookData));

const getAllFriendsBookRequestsStatus = createSelector(getFriendsDataState, (friendsDataState) => friendsDataState.bookRequests);
const getAllFriendsBookRequests = createSelector(getAllFriendsBookRequestsStatus, (friendsDataBookRequestsStatus) => getData(friendsDataBookRequestsStatus));
const getAllFriendsBookRequestsMap = createSelector(getAllFriendsBookRequests, (bookRequests) => getIdMap('bookDataId', bookRequests));

const getAllFriendsBookRequestsSorted = createSelector(getAllFriendsBookRequests, (bookRequests) => bookRequests?.sort(sortByInnerNumber('bookDataId')));

export const friendsDataSelector = {
  getAllFriendsDataBookDataStatus,
  getAllFriendsBookRequestsStatus,

  getAllFriendsDataBookData,
  getAllFriendsDataBookDataMap,

  getAllFriendsBookRequests,
  getAllFriendsBookRequestsMap,

  getAllFriendsBookRequestsSorted,
};
