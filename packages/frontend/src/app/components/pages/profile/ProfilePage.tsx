import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AccountBoxSharp } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { ProfilePath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { userSelector } from 'app/modules/user/userSelector';
import { userAction } from 'app/modules/user/userAction';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { ConfirmationDialog } from 'app/components/blocks/confirmation-dialog/ConfirmationDialog';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  user: User | undefined;
}

interface DispatchProps {
  deleteUser: typeof userAction.startDeleteUser;
  setDialogState: typeof dialogAction.setState;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const messages = PageMessages.profile;

const BaseProfilePage: FC<Props> = (props) => {
  const {
    user, deleteUser, setDialogState,
    history,
  } = props;
  if (isUndefined(user)) {
    return <UnknownError />;
  }

  const cardData: CardData = {
    header: getCardHeader(messages.header, AccountBoxSharp),
    items: [
      getItem({ label: messages.labels.email, value: user.email }),
      getItem({ label: messages.labels.name, value: user.name }),
      getItem({ label: messages.labels.publicProfile, value: user.publicProfile }),
      getItem({ label: messages.labels.description, value: user.description })],
    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        label: ButtonMessage.DeleteProfile,
        onClick: (): void => {
          setDialogState(true);
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          history.push(ProfilePath.profileEdit);
        },
      }),
    ],
  };

  const confirmationData = {
    header: getCardHeader(messages.deleteDialog.header),
    description: getDescription(messages.deleteDialog.description),
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        deleteUser(user.id);
      },
    }),
  };

  return (
    <>
      <Card data={cardData} />
      <ConfirmationDialog data={confirmationData} />
    </>
  );
};

export const ProfilePage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    user: userSelector.getCurrentUser(state),
  }),
  {
    deleteUser: userAction.startDeleteUser,
    setDialogState: dialogAction.setState,
  },
)(withRouter(withLoading(
  BaseProfilePage,
  userSelector.getCurrentUserStatus,
)));
