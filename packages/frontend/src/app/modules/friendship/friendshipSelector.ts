import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';

import { FriendshipState } from './friendshipReducer';
import { userSelector } from '../user/userSelector';


const getFriendshipState = (state: AppState): FriendshipState => state.friendshipState;

const getAllFriendshipStatus = createSelector(getFriendshipState, (friendshipState) => friendshipState.friendships);
const getAllFriendship = createSelector(getAllFriendshipStatus, (friendshipsStatus) => getData(friendshipsStatus));

const getAllFriendshipRequest = createSelector([getAllFriendship, userSelector.getCurrentUser], (friends, user) => (
  friends?.filter(
    (friend) => !friend.confirmed && friend.toUserId === user?.id
  )
));
const getAllFriendshipPending = createSelector([getAllFriendship, userSelector.getCurrentUser], (friends, user) => (
  friends?.filter(
    (friend) => !friend.confirmed && friend.fromUserId === user?.id
  )
));
const getAllFriendshipConfirmed = createSelector(getAllFriendship, (friends) => friends?.filter((friend) => friend.confirmed));

const getFoundUserStatus = createSelector(getFriendshipState, (friendshipState) => friendshipState.searchedUser);
const getFoundUser = createSelector(getFoundUserStatus, (foundUserStatus) => getData(foundUserStatus));

export const friendshipSelector = {
  getAllFriendshipStatus,
  getFoundUserStatus,

  getAllFriendshipRequest,
  getAllFriendshipPending,
  getAllFriendshipConfirmed,

  getFoundUser,
};
