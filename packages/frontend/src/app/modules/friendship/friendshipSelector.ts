import { createSelector } from 'reselect';

import { getData } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';

import { FriendshipState } from './friendshipReducer';
import { userSelector } from '../user/userSelector';


const getFriendshipState = (state: AppState): FriendshipState => state.friendshipState;

const getAllFriendshipStatus = createSelector(getFriendshipState, (friendshipState) => friendshipState.friendships);
const getAllFriendship = createSelector(getAllFriendshipStatus, (friendshipsStatus) => getData(friendshipsStatus));

const getAllFriendRequest = createSelector([getAllFriendship, userSelector.getCurrentUser], (friends, user) => (
  friends?.filter(
    (friend) => !friend.confirmed && friend.toUserId === user?.id
  )
));
const getAllFriendPending = createSelector([getAllFriendship, userSelector.getCurrentUser], (friends, user) => (
  friends?.filter(
    (friend) => !friend.confirmed && friend.fromUserId === user?.id
  )
));
const getAllConfirmedFriendship = createSelector(getAllFriendship, (friends) => friends?.filter((friend) => friend.confirmed));

export const friendshipSelector = {
  getAllFriendship,
  getAllFriendRequest,
  getAllFriendPending,
  getAllConfirmedFriendship,
};
