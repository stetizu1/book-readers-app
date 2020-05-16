import React, { FC } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { GroupAddSharp, WarningSharp } from '@material-ui/icons';

import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { isStatus, Status } from 'app/constants/Status';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';
import { ErrorMessage } from 'app/messages/ErrorMessage';

import { AppState } from 'app/types/AppState';
import { IdMapOptional } from 'app/types/IdMap';

import { friendshipSelector } from 'app/modules/friendship/friendshipSelector';
import { friendshipAction } from 'app/modules/friendship/friendshipAction';
import { userSelector } from 'app/modules/user/userSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { InfoCard } from 'app/components/blocks/card-components/info-card/InfoCard';
import { getDescription } from '../../blocks/card-layout/body/description/getDescription';
import { MenuPath } from '../../../constants/Path';


interface StateProps {
  foundUser: User | undefined;
  friends: IdMapOptional<User> | undefined;
  foundUserStatus: Status<User>;
  currentUserEmail: string | undefined;
}

interface DispatchProps {
  addFriend: typeof friendshipAction.startCreateFriendship;
  refresh: typeof friendshipAction.refreshUserGetByEmail;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const BaseFoundUserComponent: FC<Props> = (props) => {
  const {
    foundUserStatus, foundUser,
    friends, addFriend, refresh,
    currentUserEmail,
    history,
  } = props;

  if (isStatus.failure(foundUserStatus) || currentUserEmail === foundUser?.email) {
    return (
      <InfoCard data={{
        header: getCardHeader(ErrorMessage.userSearchNotFound, WarningSharp),
        description: getDescription(ErrorMessage.userSearchNotFoundDescription),
      }}
      />
    );
  }

  if (isUndefined(foundUser) || isUndefined(friends)) return null;

  const {
    id, email, name, description,
  } = foundUser;

  const buttonLeft = isUndefined(friends[id])
    ? getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.RequestFriends,
      onClick: () => {
        addFriend({ toUserId: id });
        refresh();
        history.push(MenuPath.friends);
      },
    })
    : getDescription(PageMessages.friendship.alreadyFriend);

  const cardData: CardData = {
    header: getCardHeader(PageMessages.profile.header, GroupAddSharp),
    items: [
      getItem({ label: PageMessages.profile.emailHeader, value: email }),
      getItem({ label: PageMessages.profile.nameHeader, value: name }),
      getItem({ label: PageMessages.profile.descriptionHeader, value: description }),
    ],
    buttons: [getDescription(''), buttonLeft],
  };

  return (
    <Card data={cardData} />
  );
};

export const FoundUserComponent = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    foundUser: friendshipSelector.getFoundUser(state),
    foundUserStatus: friendshipSelector.getFoundUserStatus(state),
    friends: userSelector.getUsersMap(state),
    currentUserEmail: userSelector.getCurrentUserEmail(state),
  }),
  {
    addFriend: friendshipAction.startCreateFriendship,
    refresh: friendshipAction.refreshUserGetByEmail,
  },
)(withRouter(withLoading(BaseFoundUserComponent, friendshipSelector.getFoundUserStatus)));
