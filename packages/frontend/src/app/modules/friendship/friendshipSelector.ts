import { createSelector } from 'reselect';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

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

const getFriendUsers = createSelector(
  [userSelector.getUsersMap, userSelector.getCurrentUserId, getAllFriendshipConfirmed],
  (usersMap, currentUserId, friendships) => {
    if (isUndefined(usersMap) || isUndefined(currentUserId) || isUndefined(friendships)) return undefined;
    return friendships.map((friendship) => {
      const otherUserId = friendship.toUserId !== currentUserId ? friendship.toUserId : friendship.fromUserId;
      return usersMap[otherUserId];
    });
  },
);

export const friendshipSelector = {
  getAllFriendshipStatus,
  getFoundUserStatus,

  getAllFriendshipRequest,
  getAllFriendshipPending,
  getAllFriendshipConfirmed,

  getFoundUser,
  getFriendUsers,
};
