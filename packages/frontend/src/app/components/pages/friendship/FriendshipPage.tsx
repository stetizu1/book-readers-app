import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { DeleteForeverSharp, GroupSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Friendship } from 'book-app-shared/types/Friendship';
import { User } from 'book-app-shared/types/User';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { FriendsPath, LibraryPath, WishlistPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';
import { HeaderType } from 'app/constants/style/types/HeaderType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { withParameterPath } from 'app/helpers/path/parameters';

import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';
import { userSelector } from 'app/modules/user/userSelector';
import { friendshipAction } from 'app/modules/friendship/friendshipAction';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { ConfirmationDialog } from 'app/components/blocks/confirmation-dialog/ConfirmationDialog';
import { CardData } from 'app/components/blocks/card-components/card/Card';
import { Cards } from 'app/components/blocks/cards-component/cards/Cards';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';


interface StateProps {
  friendshipConfirmed: Friendship[] | undefined;
  friendshipPending: Friendship[] | undefined;
  friendshipRequest: Friendship[] | undefined;

  currentUserId: number | undefined;
  users: IdMap<User> | undefined;
}

interface DispatchProps {
  confirmFriendship: typeof friendshipAction.startConfirmFriendship;
  deleteFriendship: typeof friendshipAction.startDeleteFriendship;
  setDialogState: typeof dialogAction.setState;
  refresh: typeof friendshipAction.refreshUserReadByEmail;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.friendship;

const BaseFriendPage: FC<Props> = (props) => {
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  const {
    friendshipConfirmed, friendshipPending, friendshipRequest,
    confirmFriendship, deleteFriendship,
    users, currentUserId,
    setDialogState,
    history,
    refresh,
  } = props;

  if (isUndefined(friendshipConfirmed) || isUndefined(friendshipPending) || isUndefined(friendshipRequest) || isUndefined(users)) {
    return <UnknownError />;
  }

  const getOtherUser = (friendship: Friendship): User => {
    const userId = friendship.toUserId !== currentUserId ? friendship.toUserId : friendship.fromUserId;
    return users[userId];
  };

  const getBaseCardData = (friendship: Friendship): CardData => {
    const user = getOtherUser(friendship);
    return {
      header: getCardHeader(user.email, GroupSharp),
      items: [
        getItem({
          value: user.name,
        }),
        getItem({
          value: user.description,
        }),
      ],
      buttons: [
        getButton({
          buttonType: ButtonType.dialogDelete,
          label: <DeleteForeverSharp />,
          onClick: (): void => {
            setDeleteId(user.id);
            setDialogState(true);
          },
        }),
      ],
    };
  };

  const getCardData = (friendship: Friendship): CardData => {
    const cardData = getBaseCardData(friendship);
    const user = getOtherUser(friendship);
    const { buttons = [] } = cardData;
    return {
      ...cardData,
      buttons: [
        ...buttons,
        getButton({
          buttonType: ButtonType.button,
          label: ButtonMessage.Library,
          onClick: (): void => {
            history.push(withParameterPath(LibraryPath.libraryFriends, user.id));
          },
        }),
        getButton({
          buttonType: ButtonType.button,
          label: ButtonMessage.Wishlist,
          onClick: (): void => {
            history.push(withParameterPath(WishlistPath.wishlistFriends, user.id));
          },
        }),
      ],
    };
  };

  const getConfirmableCardData = (friendship: Friendship): CardData => {
    const cardData = getBaseCardData(friendship);
    const user = getOtherUser(friendship);
    const { buttons = [] } = cardData;
    return {
      ...cardData,
      buttons: [
        ...buttons,
        getButton({
          buttonType: ButtonType.edit,
          label: ButtonMessage.Confirm,
          onClick: (): void => {
            confirmFriendship(user.id, { confirmed: true });
          },
        }),
      ],
    };
  };
  const getPendingCardData = (friendship: Friendship): CardData => {
    const cardData = getBaseCardData(friendship);
    const { buttons = [] } = cardData;
    return {
      ...cardData,
      buttons: [
        ...buttons,
        getDescription(messages.descriptions.pending),
      ],
    };
  };

  const confirmationData = {
    header: getCardHeader(messages.deleteDialog.header),
    description: getDescription(messages.deleteDialog.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        if (!isUndefined(deleteId)) {
          deleteFriendship(deleteId);
          setDialogState(false);
        }
      },
    }),
  };

  const buttons = [
    getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.AddFriend,
      onClick: (): void => {
        refresh();
        history.push(FriendsPath.friendAdd);
      },
    }),
  ];

  const getKey = (friendship: Friendship): string => `${friendship.fromUserId}-${friendship.toUserId}`;
  return (
    <>
      {getPageHeader(messages.pageHeader)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}

      {getPageHeader(messages.pageSubHeaders.confirmed, HeaderType.subheader)}
      <Cards data={friendshipConfirmed} getCardData={getCardData} getKey={getKey} />

      {getPageHeader(messages.pageSubHeaders.requests, HeaderType.subheader)}
      <Cards data={friendshipRequest} getCardData={getConfirmableCardData} getKey={getKey} />

      {getPageHeader(messages.pageSubHeaders.pending, HeaderType.subheader)}
      <Cards data={friendshipPending} getCardData={getPendingCardData} getKey={getKey} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const FriendshipPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    friendshipConfirmed: friendshipSelector.getAllFriendshipConfirmed(state),
    friendshipPending: friendshipSelector.getAllFriendshipPending(state),
    friendshipRequest: friendshipSelector.getAllFriendshipRequest(state),

    currentUserId: userSelector.getCurrentUserId(state),
    users: userSelector.getUsersMap(state),
  }),
  {
    confirmFriendship: friendshipAction.startConfirmFriendship,
    deleteFriendship: friendshipAction.startDeleteFriendship,
    setDialogState: dialogAction.setState,
    refresh: friendshipAction.refreshUserReadByEmail,
  },
)(withRouter(withLoading(
  BaseFriendPage,
  friendshipSelector.getAllFriendshipStatus,
  userSelector.getCurrentUserStatus,
  userSelector.getUsersStatus,
)));
