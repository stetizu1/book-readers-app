import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { GroupSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { Friendship } from 'book-app-shared/types/Friendship';
import { User } from 'book-app-shared/types/User';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { FriendPath } from 'app/constants/Path';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';
import { IdMap } from 'app/types/IdMap';

import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';
import { userSelector } from 'app/modules/user/userSelector';
import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { friendshipAction } from 'app/modules/friendship/friendshipAction';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { ConfirmationDialog } from 'app/components/blocks/card-components/confirmation-dialog/ConfirmationDialog';
import { CardData } from 'app/components/blocks/card-components/card/Card';

import { getButtonsLayout } from 'app/components/blocks/card-layout/buttons/getButtonsLayout';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getPageHeader } from 'app/components/blocks/page-header/getPageHeader';
import { Cards } from '../../blocks/card-components/cards/Cards';
import { HeaderType } from '../../../constants/style/types/HeaderType';


interface StateProps {
  friendshipConfirmed: Friendship[] | undefined;
  friendshipPending: Friendship[] | undefined;
  friendshipRequest: Friendship[] | undefined;

  currentUserId: number | undefined;
  users: IdMap<User> | undefined;

  isConfirmDialogOpen: boolean;
}

interface DispatchProps {
  confirmFriendship: typeof friendshipAction.startConfirmFriendship;
  deleteFriendship: typeof friendshipAction.startDeleteFriendship;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;


const BaseFriendPage: FC<Props> = (props) => {
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  const {
    friendshipConfirmed, friendshipPending, friendshipRequest,
    confirmFriendship, deleteFriendship,
    users, currentUserId,
    isConfirmDialogOpen, setDialogState,
    history,
  } = props;

  if (isUndefined(friendshipConfirmed) || isUndefined(friendshipPending) || isUndefined(friendshipRequest) || isUndefined(users)) {
    return null;
  }

  const getOtherUser = (friendship: Friendship): User => {
    const userId = friendship.toUserId !== currentUserId ? friendship.toUserId : friendship.fromUserId;
    return users[userId];
  };

  const getCardData = (friendship: Friendship): CardData => {
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
          buttonType: ButtonType.delete,
          onClick: (): void => {
            setDeleteId(user.id);
            setDialogState(true);
          },
        }),
      ],
    };
  };
  const getConfirmableCardData = (friendship: Friendship): CardData => {
    const user = getOtherUser(friendship);
    const cardData = getCardData(friendship);
    const { buttons = [] } = cardData;
    return {
      ...cardData,
      buttons: [
        ...buttons,
        getButton({
          buttonType: ButtonType.edit,
          label: ButtonMessage.confirm,
          onClick: (): void => {
            confirmFriendship(user.id, { confirmed: true });
          },
        }),
      ],
    };
  };
  const getPendingCardData = (friendship: Friendship): CardData => {
    const cardData = getCardData(friendship);
    const { buttons = [] } = cardData;
    return {
      ...cardData,
      buttons: [
        ...buttons,
        getDescription(PageMessages.friendship.pending),
      ],
    };
  };

  const confirmationData = {
    header: getCardHeader(PageMessages.labels.delete.header),
    description: getDescription(PageMessages.labels.delete.description),
    onCancelClick: (): void => {
      setDialogState(false);
    },
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
        history.push(FriendPath.add);
      },
    }),
  ];

  const getKey = (friendship: Friendship): string => `${friendship.fromUserId}-${friendship.toUserId}`;
  return (
    <>
      {getPageHeader(PageMessages.friendship.header)}
      {getButtonsLayout(buttons, ButtonLayoutType.outsideAdjacent)}

      {getPageHeader(PageMessages.friendship.confirmed, HeaderType.subheader)}
      <Cards data={friendshipConfirmed} getCardData={getCardData} getKey={getKey} />

      {getPageHeader(PageMessages.friendship.requestsHeader, HeaderType.subheader)}
      <Cards data={friendshipRequest} getCardData={getConfirmableCardData} getKey={getKey} />

      {getPageHeader(PageMessages.friendship.pendingHeader, HeaderType.subheader)}
      <Cards data={friendshipPending} getCardData={getPendingCardData} getKey={getKey} />
      <ConfirmationDialog data={confirmationData} isOpen={isConfirmDialogOpen} />
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

    isConfirmDialogOpen: dialogSelector.getIsOpen(state),
  }),
  {
    confirmFriendship: friendshipAction.startConfirmFriendship,
    deleteFriendship: friendshipAction.startDeleteFriendship,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(BaseFriendPage, friendshipSelector.getAllFriendshipStatus)));
