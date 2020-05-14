import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AccountBoxSharp } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ProfilePath } from 'app/constants/Path';
import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';
import { AppState } from 'app/types/AppState';

import { userSelector } from 'app/modules/user/userSelector';

import { userAction } from 'app/modules/user/userAction';
import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { CardComponent, CardData } from 'app/components/common/CardComponent';
import { ConfirmationDialogComponent } from 'app/components/common/ConfirmationDialogComponent';
import { getButton } from 'app/components/common/blockCreators/getButton';

import { useButtonStyle } from 'app/components/common/styles/buttons/ButtonsStyle';
import { useContainerStyle } from 'app/components/common/styles/ContainerStyle';
import { getHeader } from 'app/components/common/blockCreators/getHeader';
import { getImage } from 'app/components/common/blockCreators/getImage';
import { getCardWithItem } from 'app/components/common/blockCreators/getCardWithItem';
import { getText } from 'app/components/common/blockCreators/getText';


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
  const buttonClasses = useButtonStyle();
  const classes = useContainerStyle();

  const user = props.user;
  if (isUndefined(user)) return null;

  const cardData: CardData = {
    header: getHeader(PageMessages.profile.header),
    image: getImage(AccountBoxSharp),
    items: {
      left: {
        top: [
          getCardWithItem({ label: PageMessages.profile.emailHeader, value: user.email }),
          getCardWithItem({ label: PageMessages.profile.nameHeader, value: user.name }),
          getCardWithItem({ label: PageMessages.profile.publicProfileHeader, value: user.publicProfile }),
          getCardWithItem({ label: PageMessages.profile.descriptionHeader, value: user.description })],
      },
    },
    buttons: [
      getButton({
        variant: ButtonVariant.text,
        classType: buttonClasses.deleteOption,
        label: ButtonMessage.DeleteProfile,
        onClick: (): void => {
          props.setDialogState(true);
        },
      }), getButton({
        variant: ButtonVariant.contained,
        classType: buttonClasses.edit,
        label: ButtonMessage.Edit,
        onClick: (): void => {
          props.history.push(ProfilePath.editProfile);
        },
      }),
    ],
  };

  const confirmationData = {
    header: getHeader(PageMessages.profile.delete.header),
    text: getText(PageMessages.profile.delete.description),
    onCancelClick: (): void => {
      props.setDialogState(false);
    },
    confirmButton: getButton({
      classType: buttonClasses.deleteButton,
      onClick: (): void => {
        props.deleteUser(user.id);
      },
    }),
  };

  return (
    <>
      <div className={classes.container}>
        <CardComponent data={cardData} />
      </div>
      <ConfirmationDialogComponent data={confirmationData} isOpen={props.isConfirmDialogOpen} />
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
