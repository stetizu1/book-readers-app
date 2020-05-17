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
import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { Card, CardData } from 'app/components/blocks/card-components/card/Card';
import { ConfirmationDialog } from 'app/components/blocks/card-components/confirmation-dialog/ConfirmationDialog';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getItem } from 'app/components/blocks/card-items/items-list/item/getItem';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  user: User | undefined;
  isConfirmDialogOpen: boolean;
}

interface DispatchProps {
  deleteUser: typeof userAction.startDeleteUser;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const BaseProfilePage: FC<Props> = (props) => {
  const { user } = props;
  if (isUndefined(user)) return null;

  const cardData: CardData = {
    header: getCardHeader(PageMessages.profile.header, AccountBoxSharp),
    items: [
      getItem({ label: PageMessages.profile.emailHeader, value: user.email }),
      getItem({ label: PageMessages.profile.nameHeader, value: user.name }),
      getItem({ label: PageMessages.profile.publicProfileHeader, value: user.publicProfile }),
      getItem({ label: PageMessages.profile.descriptionHeader, value: user.description })],
    buttons: [
      getButton({
        buttonType: ButtonType.delete,
        label: ButtonMessage.DeleteProfile,
        onClick: (): void => {
          props.setDialogState(true);
        },
      }),
      getButton({
        buttonType: ButtonType.edit,
        onClick: (): void => {
          props.history.push(ProfilePath.profileEdit);
        },
      }),
    ],
  };

  const confirmationData = {
    header: getCardHeader(PageMessages.profile.delete.header),
    description: getDescription(PageMessages.profile.delete.description),
    onCancelClick: (): void => {
      props.setDialogState(false);
    },
    confirmButton: getButton({
      buttonType: ButtonType.dialogDelete,
      onClick: (): void => {
        props.deleteUser(user.id);
      },
    }),
  };

  return (
    <>
      <Card data={cardData} />
      <ConfirmationDialog data={confirmationData} isOpen={props.isConfirmDialogOpen} />
    </>
  );
};

export const ProfilePage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    user: userSelector.getCurrentUser(state),
    isConfirmDialogOpen: dialogSelector.getIsOpen(state),
  }),
  {
    deleteUser: userAction.startDeleteUser,
    setDialogState: dialogAction.setOpen,
  },
)(withRouter(withLoading(BaseProfilePage, userSelector.getCurrentUserStatus)));
